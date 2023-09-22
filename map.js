

const svg = d3.select("#map")
const g = svg
    .append("g")

const path = d3.geoPath()
const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

// Map and projection
// let projection = d3.geoMercator()
let projection = d3.geoNaturalEarth1()
    .center([33.937761, -0.976635]) // GPS of location to zoom on
    // .scale(760) // When merged with timeline
    .scale(860) // When merged with timeline
    // .translate([width / 2, height / 2]) // CENTER
    .translate([width / 9, height / 1.4])


let mapData, institutions, publications, events, places, nodes;

importData().then((data) => {
    setCoordinates();
    setForce();
    render();
})


function parseEventDate(date) {
    return +date.slice(-4)
}