// ---- VARIABLES --- //
let pop = [];
let projectedPop = [];

let gsf = [];
let projectedGsf = [];


// ---- GRAPH CONTAINER SETUP --- //
const margin = { top: 40, right: 20, bottom: 50, left: 100 };
const graphWidth = 800 - margin.left - margin.right;
graphHeight = 500 - margin.top - margin.bottom;

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
const popScale = d3.scaleLinear().range([graphHeight, 0]);
const gsfScale = d3.scaleLinear().range([graphHeight, 0]);

const yearAxisGroup = graph.append('g')
    .attr('class', 'year-axis')
    .attr('transform', `translate(0, ${graphHeight})`);

const popAxisGroup = graph.append('g')
    .attr('class', 'pop-axis');

const gsfAxisGroup = graph.append('g')
    .attr('class', 'gsf-axis');


// ---- RETRIEVE DATA --- //
db.collection("population").orderBy('year').get().then((res) => {
    res.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        const document = { ...doc.data(), id: doc.id }
        pop.push(document);

    });

    // set graph axes domains
    yearScale.domain(d3.extent(pop, p => p.year));
    popScale.domain([10000, d3.max(pop, p => p.students)]);

    const yearAxis = d3.axisBottom(yearScale)
        .ticks(4)
        .tickFormat(d3.format("d"));

    const popAxis = d3.axisLeft(popScale)
        .ticks(4);

    yearAxisGroup.call(yearAxis);
    popAxisGroup.call(popAxis);

    const points = graph.selectAll('circle')
        .data(pop);

    points.enter()
        .append('circle')
        .attr('r', 2)
        .attr('cx', d => yearScale(d.year))
        .attr('cy', d => popScale(d.students))
        .attr('fill', 'orange');

    graph.append("path")
        .datum(pop)
        .attr("fill", "orange")
        .attr("fill-opacity", .3)
        .attr("stroke", "orange")
        .attr("d", d3.area()
            .x(function (d) { return yearScale(d.year) })
            .y0(graphHeight)
            .y1(function (d) { return popScale(d.students) })
        )
    /* draw path
    graph.append("path")
        .datum(data)
        .attr("fill", "steelblue")
        .attr("d", area);
    */
});


console.log(pop);

const draw = (d) => {
    const points = graph.selectAll('circle');
    points.append('circle')
        .attr('r', 1)
        .attr('cx', year => yearScale(year))
}