const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const req = new XMLHttpRequest();
req.open("GET", url, true);
req.send();
req.onload = () =>{
    dataset = JSON.parse(req.responseText);
    values = dataset.monthlyVariance;
    baseTemperature = dataset.baseTemperature;
    console.log(baseTemperature);
    creatingScales();
    genAxes();
    cells();
    
}

//Definign Global Variables

let dataset;
let yScale;
let xScale;
let xAxis;
let yAxis
let width = 1200;
let height = 600;
let padding = 60;
let baseTemperature;
let values;
let variance;
//Defining svg element and functions

const svg = d3.select('svg').attr('width', width).attr('height', height);
let hoverTool = d3.select('#tooltip')

const creatingScales = () =>{
xScale = d3.scaleLinear()
.domain([d3.min(values, (d) => d['year']), d3.max(values, (d) => d['year']) + 1]).range([padding, width - padding])
yScale = d3.scaleTime().domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
.range([padding, height - padding])
}

const cells =() =>{
        
    svg.selectAll('rect').data(values).enter().append('rect').attr('class', 'cell')
        .attr('fill', (d) => {
            variance = d['variance'];
            if(variance <=-1){
                return 'steelblue';
            }
            else if(variance <=0){
                return 'lightsteelblue'
            }
            else if(variance <= 1){
                return 'orange';
            }
            else{
                return 'crimson';
            }
        })
        .attr('data-year', (d) => d['year'])
        .attr('data-month', (d) => d['month'] - 1)
        .attr('data-temp', (d) => {
            return baseTemperature + d['variance'];
        })
        .attr('height', (height - (2 * padding)) / 12) 
        .attr('y', (d) => yScale(new Date(0, d['month'] -1 , 0, 0, 0, 0, 0)))
        .attr('width', (d) => {
            let numYear = d3.max(values, (d) => d['year']) - d3.min(values, (d) => d['year']);
            return (width - (2 * padding )) / numYear;
        })
        .attr('x', (d) => xScale(d['year']))
        .on('mouseover', (d) =>{
            hoverTool.transition().style('visibility', 'visible')
            let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
            hoverTool.text(d['year'] + ' ' +  monthNames[d['month'] - 1] + ' - ' + (baseTemperature + d['variance']) +'℃ (' + d['variance'] + '℃)')

            hoverTool.attr('data-year', d['year'])
        })
        .on('mouseout', (d) =>{
            hoverTool.transition()
                        .style('visibility', 'hidden')
        })
}

const genAxes = () =>{

    xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d')).tickSize(10,1);
    svg.append('g').call(xAxis).attr('id', 'x-axis').attr("transform", "translate(0, " + (height - padding) + ")")
    yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));
    svg.append('g').call(yAxis).attr('id', 'y-axis').attr("transform", "translate(" + padding + ", 0)")

}