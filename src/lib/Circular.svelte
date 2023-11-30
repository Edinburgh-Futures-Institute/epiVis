<script lang="ts">
    import * as d3 from "d3";

    import {onMount} from "svelte";
    import {affiliationsFilename, authorsFilename, papersFilename} from "../dataLoader.ts";

    // export let filteredData;

    let specPath = "../netpanorama-vis/templates/institutionProj.json"
    let width: number = 1200;
    let height: number = 600;

    let legendWidth = 200;
    let legendHeight = 350;

    let institutions;
    let links;

    let element: HTMLElement;
    let svg: HTMLElement;
    let svgLegend: SVGElement;
    let colorScale = d3.scaleLinear([0, 10], ["white", "blue"]);

    onMount(() => {
        getNetpanNet().then(() => {
            render();
        })
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        width = rect.width - legendWidth - 200;
        height = rect.height;
    }

    async function getNetpanNet() {
        if (width && element) {
            // element.innerHTML = ""

            let viewer = await NetPanoramaTemplateViewer.render(specPath, {
                affiliations: affiliationsFilename,
                width: width,
                height: height
            }, "affiliationNet");

            // institutions = viewer.state.networkAff.nodes
            institutions = viewer.state.network.nodes
            links = viewer.state.network.links
        }
    }

    function render(width, height) {
        if (!svg) return;

        institutions.sort((a, b) => {
            let countryCompare = a.data["Country "].localeCompare(b.data["Country "])
            if (countryCompare == 0) {
                return a.data["Discipline"].localeCompare(b.data["Discipline"])
            }
            return countryCompare
        })

        let currentCountry = institutions[0].data["Country "]
        let pos = 1
        let countryToCount = {};

        for (let inst of institutions) {
            let country = inst.data["Country "]

            if (countryToCount[country]) {
                countryToCount[country] += 1
            } else {
                countryToCount[country] = 1
            }

            if (currentCountry != country) {
                pos += 1;
                currentCountry = country;
            }
            inst.pos = pos;

            pos += 1;
        }

        const radialScale = d3.scaleLinear([0, pos], [0, Math.PI * 2])

        // const countryColorScale = d3.scaleOrdinal(d3.schemeAccent)
        const countryColorScale = d3.scaleOrdinal(d3.schemeSet1)

        const distance = 300;
        const x = (d) => distance * Math.cos(radialScale(d.pos))
        const y = (d) => {
            return distance * Math.sin(radialScale(d.pos))
        }

        const linksMark = d3.select(svg)
            .selectAll(".link")
            .data(links)
            .join("line")
            // .attr("d", d => line(d))
            .attr("x1", d => x(d.source))
            .attr("y1", d => y(d.source))
            .attr("x2", d => x(d.target))
            .attr("y2", d => y(d.target))
            .attr("stroke", "black")
            .classed("link", true)

        d3.select(svg)
            .selectAll(".node")
            .data(institutions)
            .join("circle")
            .attr("cx", d => x(d))
            .attr("cy", d => y(d))
            .attr("r", 7)
            // .attr("fill", d => countryColorScale(d.data["Country "]))
            .attr("fill", d => countryColorScale(d.data["Discipline"]))
            // .attr("fill", d => "none")
            .attr("stroke", "black")
            .classed("node", true)
        // .attr("transform", d => `rotate(${radialScale(d.pos) * 180 / Math.PI}) translate(300,0)`)


        const pie = d3.pie().padAngle(0.05).sort(null).sortValues(null).startAngle(Math.PI / 2).endAngle(3 * Math.PI);
        const arc = d3.arc().innerRadius(distance + 40).outerRadius(distance + 40 + 50);

        const countries = d3.select(svg)
            .append("g")
            .attr("fill", "#ccc")
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .attr("stroke-linejoin", "round")
            .selectAll("path")
            .data(pie(Object.values(countryToCount)))
            .join("path")
            .attr("d", arc.cornerRadius(6));


        d3.select(svg)
            .selectAll("text")
            .data(pie(Object.values(countryToCount)))
                .join("text")
                .attr("transform", (d, i) => {
                    return `translate(${arc.centroid(d)})`
                })
                .attr("x", (d, i) => {
                    return 0;
                })
                .attr("y", d => {
                    return 0
                })
                .text((d, i) => {
                    return Object.keys(countryToCount)[i]
                })
                .attr("text-anchor", "middle")


    // Add one dot in the legend for each name.
        console.log(2323, countryColorScale.domain())
    d3.select(svgLegend)
        .selectAll("mydots")
      .data(countryColorScale.domain())
      .join("circle")
        .attr("cx", 100)
        .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function(d){ return countryColorScale(d)})

    // Add one dot in the legend for each name.
    d3.select(svgLegend)
    .selectAll("mylabels")
      .data(countryColorScale.domain())
      .join("text")
        .attr("x", 120)
        .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function(d){ return countryColorScale(d)})
        .text(function(d){ return d})
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
    }



        // $: render(width, height)
</script>

<div id="circular-div" bind:this={element} on:resize={updateDimensions}>
    <svg bind:this={svg} width={width} height={width} viewBox="{-width / 2}, {-width / 2}, {width}, {width}">
        <!--    <svg bind:this={svg} width={width} height={width}>-->
    </svg>
    <svg  bind:this={svgLegend} width={legendWidth} height={legendHeight}>
    </svg>
</div>
<div id="affiliationNet">
</div>


<style>
    #circular-div {
        /*flex-grow: 1;*/
        /*flex: 1;*/
        /*width: 0;*/
        /*width: 1000px;*/
        /*height: 1000px;*/
        justify-content: center;
        align-items: center;
    }

    svg {
        display: inline-block;
        vertical-align: top;
    }
</style>

