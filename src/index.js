import * as d3 from "d3";
import "./index.css";

const data = [
    { display: "Not Busy", limit: 20, color: "#78c346" },
    { display: "Busy", limit: 100, color: "#ffc20a" },
    { display: "Overcrowded", limit: 140, color: "#ed5e00" },
    { display: "Severe", limit: 180, color: "#c00" },
    { display: "Disaster", limit: 200, color: "#1c1f21" }
];

const constantHelpers = {
    START_POS_X: 300,
    START_POS_Y: 100,
    BAR_WIDTH: 200
};
const thresholdScale = d3
    .scaleThreshold()
    .domain(data.map(d => d.limit))
    .range(data.map(d => d.color));

const scale = d3
    .scaleLinear()
    .domain([0, 200])
    .range([400, 0]);

const xAxis = d3
    .axisRight(scale)
    .tickSize(13)
    .tickValues(thresholdScale.domain())
    .tickFormat((d, i) => `${d}: ${data[i].display}`);

const svg = d3
    .select("#root")
    .append("svg")
    .classed("svg-app", true);

const axis = svg.append("g").classed("axis", true);

const g = axis
    .attr(
        "transform",
        `translate(${constantHelpers.START_POS_X +
            constantHelpers.BAR_WIDTH}, ${constantHelpers.START_POS_Y})`
    )
    .call(xAxis);
const thresholdGroup = svg
    .append("g")
    .classed("svg-threshold", true)
    .attr("transform", `translate(0, 100)`);

g.select(".domain").remove();

thresholdGroup
    .selectAll("rect")
    .data(
        thresholdScale.range().map(color => {
            const d = thresholdScale.invertExtent(color);
            if (!d[0]) {
                d[0] = scale.domain()[0];
            }
            if (!d[1]) {
                d[1] = scale.domain()[1];
            }
            return d;
        })
    )
    .enter()
    .append("rect")
    .attr("aria-describedby", (d, i) => data[i].display.toLowerCase())
    .attr(
        "transform",
        d =>
            `translate(${constantHelpers.START_POS_X}, ${Math.abs(
                scale(d[1])
            )})`
    )
    .attr("height", d => {
        console.log(d);
        return Math.abs(scale(d[1]) - scale(d[0]))
    })
    .attr("width", constantHelpers.BAR_WIDTH)
    .attr("fill", d => thresholdScale(d[0]));
