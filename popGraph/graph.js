// ---- VARIABLES --- //
let pop = [];

let gsf = [];
let approvedGsf = [];
let projectedGsf = [];
let fourGsf = [];
let fiveGsf = [];
let makeupGsf = [];

let firstYear = 2004;
let lastYear = 2020;
let currentYear = 2011;

// ---- GRAPH CONTAINER SETUP --- //
const margin = { top: 40, right: 100, bottom: 50, left: 100 };
const axisOffset = 20;
const graphWidth = 800 - margin.left - margin.right;
const graphHeight = 500 - margin.top - margin.bottom;

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
const gsfScale = d3.scaleLinear().range([graphHeight, 100]);

const yearAxisGroup = graph.append('g')
    .attr('class', 'year-axis')
    .attr('transform', `translate(0, ${graphHeight + axisOffset})`);

const popAxisGroup = graph.append('g')
    .attr('class', 'pop-axis')
    .attr('transform', `translate(-${axisOffset}, 0)`);

const gsfAxisGroup = graph.append('g')
    .attr('class', 'gsf-axis')
    .attr('transform', `translate(${graphWidth + axisOffset}, 0)`);


// ---- RETRIEVE POPULATION DATA --- //
db.collection("population").orderBy('year').get().then((res) => {
    res.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        const document = { ...doc.data(), id: doc.id }
        pop.push(document);

    });

    // set graph axes domains
    yearScale.domain(d3.extent(pop, p => p.year));
    popScale.domain([0, 40000]);

    const yearAxis = d3.axisBottom(yearScale)
        .ticks(pop.length)
        .tickFormat(d => d % 4 == 0 ? d3.format("d")(d) : null);

    const popAxis = d3.axisLeft(popScale)
        .ticks(6)
        .tickFormat(d => d > 10000 ? d / 1e3 + "K" : null);

    yearAxisGroup.call(yearAxis);
    popAxisGroup.call(popAxis);

    // Add the line for projected numbers
    graph.append("path")
        .datum(pop.filter(d => d.projected || d.year == currentYear))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr('stroke-dasharray', "10 4")
        .attr("d", d3.line()
            .x(function (d) { return yearScale(d.year) })
            .y(function (d) { return popScale(d.students) })
        )

    // Add the line for known population
    graph.append("path")
        .datum(pop.filter(d => !d.projected))
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", d3.line()
            .x(function (d) { return yearScale(d.year) })
            .y(function (d) { return popScale(d.students) })
        )

    const popPoints = graph.selectAll('rect')
        .data(pop);

    popPoints.enter()
        .append('rect')
        .attr('width', 6)
        .attr('height', 6)
        .attr('x', d => yearScale(d.year) - 3)
        .attr('y', d => popScale(d.students) - 3)
        .attr('fill', 'black');

});


// ---- RETRIEVE GSF DATA --- //
db.collection("gsf").orderBy('year').get().then((res) => {
    res.forEach((doc) => {
        //console.log(`${doc.id} => ${doc.data()}`);
        const document = { ...doc.data(), id: doc.id }
        gsf.push(document);

    });

    // push data to approved gsf and calculate rate of increase per year
    approvedGsf.push(...gsf.slice(gsf.length - 2));
    projectedGsf.push(gsf[gsf.length - 1]);
    const gsfPerYear = (approvedGsf[1].gsf - approvedGsf[0].gsf) / (approvedGsf[1].year - approvedGsf[0].year);
    const projectedTotalGSF = gsfPerYear * (lastYear - projectedGsf[0].year) + projectedGsf[0].gsf;
    gsf.push({ year: lastYear, gsf: projectedTotalGSF, projected: true });
    projectedGsf.push(gsf[gsf.length - 1]);
    console.log(projectedGsf);


    // set graph axes domains
    gsfScale.domain([5000000, 20000000]);

    const gsfAxis = d3.axisRight(gsfScale)
        .ticks(4)
        .tickFormat(d => d / 1e6 + "M");

    gsfAxisGroup.call(gsfAxis);

    // --- areas --- //

    //area fill for 500 gsf
    fiveGsf = pop.map(p => {
        const calcedGsf = {
            year: p.year,
            gsf: p.students * 500
        };
        return calcedGsf;
    });

    graph.append("path")
        .datum(fiveGsf)
        .attr('class', 'gsf')
        .attr('id', 'five')
        .attr("fill", "orange")
        .attr("fill-opacity", .1)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return yearScale(d.year) })
            .y0(graphHeight)
            .y1(function (d) { return gsfScale(d.gsf) })
        )

    //area fill for 400 gsf
    fourGsf = pop.map(p => {
        const calcedGsf = {
            year: p.year,
            gsf: p.students * 400
        };
        return calcedGsf;
    });

    graph.append("path")
        .datum(fourGsf)
        .attr('class', 'gsf')
        .attr('id', 'four')
        .attr("fill", "orange")
        .attr("fill-opacity", .2)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return yearScale(d.year) })
            .y0(graphHeight)
            .y1(function (d) { return gsfScale(d.gsf) })
        )

    //area fill for makeup gsf
    makeupGsf.push(approvedGsf[1], fourGsf[fourGsf.length - 1], projectedGsf[1]);
    console.log(makeupGsf);

    graph.append("path")
        .datum(makeupGsf)
        .attr('class', 'gsf')
        .attr('id', 'makeup')
        .attr("fill", "url(#lines-makeup)")
        .attr("fill-opacity", .7)
        .attr("stroke", "none")
        .attr("d", d3.line()
            .x(function (d) { return yearScale(d.year) })
            .y(function (d) { return gsfScale(d.gsf) })
        )

    graph.append("path")
        .datum(makeupGsf.slice(0, 2))
        .attr("fill", "none")
        .attr("stroke", "LimeGreen")
        .attr("stroke-width", 1)
        .attr('stroke-dasharray', "10 4")
        .attr("d", d3.line()
            .x(function (d) { return yearScale(d.year) })
            .y(function (d) { return gsfScale(d.gsf) })
        )

    //area fill for known gsf
    graph.append("path")
        .datum(gsf.filter(d => !d.projected && !d.approved))
        .attr('class', 'gsf')
        .attr('id', 'known')
        .attr("fill", "orange")
        .attr("fill-opacity", .7)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return yearScale(d.year) })
            .y0(graphHeight)
            .y1(function (d) { return gsfScale(d.gsf) })
        )

    //area fill for approved gsf
    graph.append("path")
        .datum(approvedGsf)
        .attr('class', 'gsf')
        .attr('id', 'approved')
        .attr("fill", "url(#lines-dense)")
        .attr("fill-opacity", .7)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return yearScale(d.year) })
            .y0(graphHeight)
            .y1(function (d) { return gsfScale(d.gsf) })
        )

    //area fill for projected gsf
    graph.append("path")
        .datum(projectedGsf)
        .attr('class', 'gsf')
        .attr('id', 'projected')
        .attr("fill", "url(#lines-sparse)")
        .attr("fill-opacity", .7)
        .attr("stroke", "none")
        .attr("d", d3.area()
            .x(function (d) { return yearScale(d.year) })
            .y0(graphHeight)
            .y1(function (d) { return gsfScale(d.gsf) })
        )

    // --- lines --- //
    // Add the line for known gsf
    graph.append("path")
        .datum(gsf.filter(d => !d.projected))
        .attr("fill", "none")
        .attr("stroke", "DarkOrange")
        .attr("stroke-width", 3)
        .attr("d", d3.line()
            .x(function (d) { return yearScale(d.year) })
            .y(function (d) { return gsfScale(d.gsf) })
        )

    // add line for projected gsf
    graph.append("path")
        .datum(projectedGsf)
        .attr("fill", "none")
        .attr("stroke", "DarkOrange")
        .attr("stroke-width", 2)
        .attr('stroke-dasharray', "10 4")
        .attr("d", d3.line()
            .x(function (d) { return yearScale(d.year) })
            .y(function (d) { return gsfScale(d.gsf) })
        )

    // --- circles --- //
    const gsfPoints = graph.selectAll('circle')
        .data(gsf);

    gsfPoints.enter()
        .append('circle')
        .attr('r', 3)
        .attr('cx', d => yearScale(d.year))
        .attr('cy', d => gsfScale(d.gsf))
        .attr('fill', 'white')
        .attr('stroke-width', 2)
        .attr('stroke', 'DarkOrange');

    graph.selectAll('circle')
        .on('mouseover', (d, i, n) => {
            d3.select(n[i])
                .transition().duration(100)
                .attr('r', 6);
        })
        .on('mouseleave', (d, i, n) => {
            d3.select(n[i])
                .transition().duration(100)
                .attr('r', 3);
        });

    /* ---- gsf events --- //
    const gsfs = d3.selectAll('.gsf');
    gsfs.on('mouseover', (d, i, n) => {
        const curId = d3.select(n[i]).attr("id");
        console.log(curId);
        switch (curId)
    })
    */
    const gsfs = d3.selectAll('.gsf');
    gsfs.on('mouseover', mouseover)
        .on('mousemove', mousemove)
        .on('mouseleave', mouseleave);
});




// ---- SVG PATTERNS --- //
// SVG injection:
var svgPat = d3.select("body").append("svg").attr("id", "d3svg")
    .attr("width", 120)
    .attr("height", 120);

//dense pattern
svgPat.append("defs")
    .append("pattern")
    .attr("id", "lines-dense")
    .attr("width", 10)
    .attr("height", 10)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("patternTransform", "rotate(90)")
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("transform", "translate(0,0)")
    .attr("fill", "orange")
    .attr("fill-opacity", .4);

svgPat.select("defs")
    .select("#lines-dense")
    .append("rect")
    .attr("width", 9)
    .attr("height", 10)
    .attr("transform", "translate(0,0)")
    .attr("fill", "orange");

//loose pattern
svgPat.select("defs")
    .append("pattern")
    .attr("id", "lines-sparse")
    .attr("width", 10)
    .attr("height", 10)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("patternTransform", "rotate(90)")
    .append("rect")
    .attr("width", 10)
    .attr("height", 10)
    .attr("transform", "translate(0,0)")
    .attr("fill", "orange")
    .attr("fill-opacity", .4);

svgPat.select("defs")
    .select("#lines-sparse")
    .append("rect")
    .attr("width", 7)
    .attr("height", 10)
    .attr("transform", "translate(0,0)")
    .attr("fill", "orange");

//loose pattern
svgPat.select("defs")
    .append("pattern")
    .attr("id", "lines-makeup")
    .attr("width", 10)
    .attr("height", 10)
    .attr("patternUnits", "userSpaceOnUse")
    .attr("patternTransform", "rotate(90)")
    .append("rect")
    .attr("width", 2)
    .attr("height", 10)
    .attr("transform", "translate(0,0)")
    .attr("fill", "LimeGreen")
    .attr("fill-opacity", .4);

// ---- TOOLTIPS --- //
// create a tooltip
var Tooltip = d3.select('.canvas')
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
    Tooltip
        .style("opacity", 1)
    d3.select(this)
        .style("stroke", "orange");
}

var mousemove = function (d) {
    const gsfType = this.id;
    let hoverString;

    switch (gsfType) {
        case "known":
            hoverString = "Recorded GSF";
            break;
        case "projected":
            hoverString = "Projected GSF";
            break;
        default:
            hoverString = "waiting...";
            break;
    }

    Tooltip
        .html(hoverString)
        .style("left", (d3.mouse(this)[0] + 70) + "px")
        .style("top", (d3.mouse(this)[1]) + "px")
}

var mouseleave = function (d) {
    Tooltip
        .style("opacity", 0)
    d3.select(this)
        .style("stroke", "none")
}