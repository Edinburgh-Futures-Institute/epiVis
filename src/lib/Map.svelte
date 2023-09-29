<script lang="ts">
    import * as d3 from "d3";

    const width: number = 1200;
    const height: number = 800;
    let data;
    let map;
    let strain;

    let groupByCountry = {};


    let colorScale = d3.scaleLinear([0, 10], ["lightgrey", "blue"])

    // TODO: check import, prob use a store
    async function importData() {
        map = await d3.json("src/assets/ne_10m_admin_0_countries_lakes.json")
        // data = await d3.csv("src/assets/20_Sept.csv")
        data = await d3.csv("data/20_Sept.csv")
    }

    function processData() {
        let strains = data.map(d => d["AI strain"])

        for (let d of data) {
            let strain = d["AI strain"];
            let region = d["Region of study "].toLowerCase();

            if (groupByCountry[region]) {
                groupByCountry[region].push(data)
            } else {
                groupByCountry[region] = [data]
            }
        }
    }

    importData().then((_) => {
        processData();
        render();
    })

    function render() {
        let svg = d3.select("#svg")

        // const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

        // let projection = d3.geoNaturalEarth1()
        let projection = d3.geoMercator()
            .scale(200) // When merged with timeline
            .translate([width / 2, height / 2]) // CENTER

        const nations = svg
            .append("g")
            // .attr("cursor", "pointer")
            .selectAll("path")
            .data(map.features)
            .join("path")
            .attr("d", d3.geoPath().projection(projection))
            .attr("stroke", "black")
            // .attr("fill", "lightgrey")
            .attr("fill", d => {
                let country = d.properties.SOVEREIGNT.toLowerCase();

                let papers = groupByCountry[country]
                let size = papers ? papers.length : 0;

                return colorScale(size)
            })
            .attr("stroke-width", 1);
    }


    // const nations = g
    //     .append("g")
    //     .attr("cursor", "pointer")
    //     .selectAll("path")
    //     .data(map.features)
    //     .join("path")
    //     .attr("d", d3.geoPath().projection(projection))
    //     .attr("stroke", "black")
    //     .attr("fill", "lightgrey")
    //     .attr("stroke-width", 1);

    // const nodesSelection = g
    //     .append("g")
    //     .selectAll(".dot")
    //     .data(nodes)
    //     .join("path")
    //     .attr("d", d => {
    //         if (getNodeType(d) == nodeTypes.publication) {
    //             return d3.symbol().type(d3.symbolDiamond).size(RADIUS_MAP * 10)(d);
    //         } else if (getNodeType(d) == nodeTypes.institution) {
    //             return d3.symbol().type(d3.symbolSquare).size(RADIUS_MAP * 10)(d);
    //         }
    //     })
    //     .attr("stroke", d => {
    //         if (d.selected) return SELECTION_COLOR
    //         return "black"
    //     })
    //     .attr("stroke-width", d => {
    //         if (d.selected) return 3
    //         return 1
    //     })
    //     .attr("transform", (d, i) => `translate(${d.x}, ${d.y})`)
    //     .style("fill", function (d) {
    //         return colorScale(getNodeType(d))
    //     })
    //     .classed("dot", true)
    //     .on("click", (e, d) => {
    //         updateNodelinkSelection(d.Name)
    //     })

    // nations.append("title").text((d) => d.properties.geounit);
    // g.call(zoom);

</script>

<svg id="svg" width={width} height={height}>
</svg>
