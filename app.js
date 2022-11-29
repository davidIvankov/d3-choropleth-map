let countyUrl= "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
let educationUrl= "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json";

let countyData;
let educationData;
// legend

let h = 30;
let w = 300;

let dataset = ["#ffffff", "#ccffcc", "#b2ffb2", "#7fff7f", "#66ff66", "#32ff32", "#00ff00"];
let xAxLegend;
let xLegend;

let canves = d3.select("#canves");
let legend = d3.select("#legend")

let drawMap =()=>{
  let tooltip = d3.select("body")
                  .append("div")
                  .attr("id", "tooltip")
                 .style("visibility", "hidden")
                 .style("height", "auto")
                 .style("width", "auto")
  
  legend.attr("height", h)
        .attr("width", w)
        
  
  canves.selectAll("path")
        .data(countyData)
        .enter()
        .append("path")
        .attr("d", d3.geoPath())
        .attr("class", "county")
        .attr("fill", (d)=>{
    let id= d["id"];
    let county = educationData.find((d)=>{
      return d["fips"] === id
    });
    let percentage = county["bachelorsOrHigher"];
    if (percentage <= 12){
     return "#ffffff"
    } else if( percentage <= 21) {
      return "#ccffcc"
    } else if (percentage <= 30) {
      return "#b2ffb2"
    } else if (percentage <= 39) {
      return "#7fff7f"
    } else if (percentage <= 48) {
      return "#66ff66"
    } else if(percentage <= 57) {
      return "#32ff32"
    } else{
      return "#00ff00"
    }
  })
       .attr("data-fips", (d)=>{
     let id= d["id"];
    let county = educationData.find((d)=>{
      return d["fips"] === id
    });
    return county["fips"]
    
  })
      .attr("data-education", (d)=>{
     let id= d["id"];
    let county = educationData.find((d)=>{
      return d["fips"] === id
    });
    return county["bachelorsOrHigher"]
  })
      .on("mouseover", (d)=>{
     
 tooltip.transition()
          .style("visibility", "visible")
          .style("top", (event.pageY - 35) + "px")
          .style("left", (event.pageX + 5) + "px")
    
     let id= d.id;
    let county = educationData.find((d)=>{
      return d["fips"] === id
    });
    let name = county.area_name;
    let state = county.state;
    let percentage = county.bachelorsOrHigher;
    
    tooltip.text(name + ", " + state + ": " + percentage + "%")
           .attr("data-education", percentage);

        
  })
        .on("mouseleave", (d)=>{
    tooltip.transition()
           .style("visibility", "hidden")
  })
     
};

let legendScale = ()=>{
  xAxLegend= d3.scaleLinear()
               .domain([0, 7])
               .range([10, 290])
              
};

let generateAxes=()=>{
   let legAx = d3.axisBottom(xAxLegend)
                 .ticks(7)
                 .tickSize(15)
                 .tickFormat((d, i)=>[ 3, 12, 21, 30, 39, 48, 57, 66][i] + "%")
   
     legend.append("g")
        .call(legAx)
};

let legendBars=()=>{
  legend.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .attr("width", 274/7)
        .attr("height", 10)
        .attr("x", (d, i)=>xAxLegend(i) + 1)
        .attr("fill", (d)=> d)
  
};

d3.json(countyUrl).then(
(data, error)=>{
  if(error){
    console.log(error)
  } else{
    countyData= topojson.feature(data, data.objects.counties).features;
    
    d3.json(educationUrl).then(
    (data, error)=>{
      if(error){
        console.log(error)
      } else{
        educationData= data;
        console.log(educationData)
        drawMap();
        legendScale();
        generateAxes();
        legendBars();
      }
    });
  }
});
