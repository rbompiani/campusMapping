// ---- VARIABLES --- //
let pop = [];
let projectedPop = [];

let gsf = [];
let projectedGsf = [];


// ---- GRAPH CONTAINER SETUP --- //
const margin = { top: 40, right: 20, bottom: 50, left: 100 };
const graphWidth = 1000 - margin.left - margin.right;
graphHeight = 1500 - margin.top - margin.bottom;

const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', graphWidth + margin.left + margin.right)
    .attr('height', graphHeight + margin.top + margin.bottom);

const graph = svg.append('g')
    .attr('width', graphWidth)
    .attr('height', graphHeight)
    .attr('transform', `translate(${margin.left},${margin.top})`);


// ---- GRAPH SCALES / AXES --- //
const yearScale = d3.scaleLinear().range([0, graphWidth]);
const popScale = d3.scaleLinear().range([0, graphHeight]);
const gsfScale = d3.scaleLinear().range([0, graphHeight]);

const yearAxisGroup = graph.append('g')
    .attr('class', 'year-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const popAxisGroup = graph.append('g')
    .attr('class', 'pop-axis');

const gsfAxisGroup = graph.append('g')
    .attr('class', 'gsf-axis');


// ---- RETRIEVE DATA --- //
db.collection("population").get().then((res) => {
    res.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        const document = { ...doc.data(), id: doc.id }
        pop.push(document);

    });
    // set graph axes domains
    yearScale.domain(d3.extent(pop, p => p.year));
    popScale.domain([0, d3.max(pop, p => p.students)]);

    const yearAxis = d3.axisBottom(yearScale)
        .ticks(4)
        .tickFormat(d3.format("d"));

    const popAxis = d3.axisLeft(popScale)
        .ticks(4);

    yearAxisGroup.call(yearAxis);
    popAxisGroup.call(popAxis);
});


console.log(pop);

const draw = () => {

}