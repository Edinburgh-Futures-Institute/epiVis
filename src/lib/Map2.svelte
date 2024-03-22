<script lang="ts">
    import * as d3 from "d3";
    import { geoEckert3 } from "d3-geo-projection";

    import {map, countriesInTheData} from "../dataLoader.ts"
    import {onMount} from "svelte";
    import {GRAY} from "../globals.ts";
    import {Legend} from "../legend.ts";

    export let filteredData;
    export let parentEl;

    let width: number;
    let height: number = 100;

    let element;
    let projection;
    let tooltipEl: HTMLElement;
    let tooltip = "";
    let nb = "";
    let x;
    let y;

    let colorScale = d3.scaleSequential(d3.interpolateYlOrRd).domain([0, 10]);

    let grayedOut = "rgb(234,234,234)"

    let groupByCountry = {};

    function updateDimensions() {
        // console.log("update ")
        const rect = element.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }

    onMount(() => {
        updateDimensions();

        tooltipEl.style.display = "none"

        // projection = d3.geoMercator()
        // projection = geoEckert3()
            projection = d3.geoNaturalEarth1()
        .scale(180) // When merged with timeline
        .translate([width / 2, height / 2]) // CENTER

        setLegend();

        d3.select("#svg")
            .select("g")
            .selectAll("path")
            .data(map.features)
            .join("path")
            .attr("d", d3.geoPath().projection(projection))
            .attr("stroke", GRAY)
            .attr("fill", d => {
                let country = d.properties.SOVEREIGNT.toLowerCase();
                let papers = groupByCountry[country]
                let size = papers ? papers.length : 0;

                if (countriesInTheData.includes(country)) {
                    return colorScale(size)
                } else {
                    return grayedOut
                }
            })
            .attr("stroke-width", 1)
            .on("mouseover", (e, d) => {
                tooltipEl.style.display = ""

                let country = d.properties.SOVEREIGNT.toLowerCase();
                let papers = groupByCountry[country]
                let size = papers ? papers.length : 0;

                tooltip = country;
                nb = size;

                let el = parentEl.getBoundingClientRect()

                x = e.pageX - parentEl.offsetLeft;
		        y = e.pageY - (el.top + window.scrollY);
            })
            .on("mouseout", (e, d) => {
                tooltipEl.style.display = "none"
            })

        setZoom();
    });


    function processData() {
        groupByCountry = {};

        for (let d of filteredData) {
            let strain = d["AI strain"];
            let region = d["Region of study "].toLowerCase();

            if (groupByCountry[region]) {
                groupByCountry[region].push(filteredData)
            } else {
                groupByCountry[region] = [filteredData]
            }
        }
        // console.log(groupByCountry)
    }


    $: run(filteredData);

    function run(filteredData) {
        processData();
        render();
    }

    function render() {
        d3.select("#svg")
            .select("g")
            .selectAll("path")
            .attr("fill", d => {
                let country = d.properties.SOVEREIGNT.toLowerCase();

                let papers = groupByCountry[country]
                let size = papers ? papers.length : 0;

                if (countriesInTheData.includes(country)) {
                    return colorScale(size)
                } else {
                    return grayedOut
                }
            })
            .attr("stroke-width", 1);
    }


    function zoomed({transform}) {
        d3.select("#svg")
            .select("g")
            .attr("transform", transform)
      }

    function setZoom() {
        d3.select("#svg")
            // .select("g")
            .call(d3.zoom().on("zoom", zoomed));
    }

    function setLegend() {
        let leg = Legend(colorScale, {
            title: "Region of study frequency",
            tickSize: 0
        });

        let l = document.querySelector("#legend")
        if (l) {
            l.appendChild(leg);
        }
    }
</script>

<div id="main-div" bind:this={element} on:resize={updateDimensions}>

    <div id="map-tooltip" bind:this={tooltipEl} style="top: {y}px; left: {x}px;" class="tooltip">
        {tooltip} <br>
        {nb} papers
    </div>

    <div class="vis-frame">
        <div id="legend"></div>
<!--        <svg id="svg" width={width} height={height - 100}>-->

<!--        Lower height removes Antarctica -->
        <svg id="svg" width={width} height={height * 0.75}>
            <g></g>
        </svg>
    </div>
</div>


<style>
    #main-div {
        /*flex: 1 1 0;*/
        flex: 2 1 auto;
        /*width: 100%;*/
        height: 100%;
        /*flex-shrink: 0;*/
    }

    #map-tooltip {
        position: absolute;
        padding: 0.5em;
        margin: 4px;
        border: 1px solid black;

        background-color: white;
    }

    #legend {
        width:200px;
    }
</style>

