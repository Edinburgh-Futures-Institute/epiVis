<script lang="ts">
    import {authorsPapaersFilename, nodeTypeColorScale, NodeTypes, papersFilename} from "../dataLoader.ts";
    import {onMount} from "svelte";

    // export let data;
    // export let specPath;

    import * as d3 from "d3";

    let element: HTMLElement;
    let width: number = 180;
    let height: number = 600;
    const diameter = 10;
    const legendSize = 100;


    $: {
        console.log(2, element, Object.values(NodeTypes))
        if (element) {
            console.log(9999)
            d3.select("#svg-legend")
                .selectAll("path")
                .data(Object.values(NodeTypes))
                .join("path")
                .attr("d", d => {
                    console.log(10000, d)
                    if (d == NodeTypes.Person) {
                        console.log(555, d3.symbol().type(d3.symbolCircle).size(legendSize)(d))
                        return d3.symbol().type(d3.symbolCircle).size(legendSize)();
                    } else if (d == NodeTypes.Paper) {
                        return d3.symbol().type(d3.symbolSquare).size(legendSize)();
                    } else if (d == NodeTypes.Strain) {
                        return d3.symbol().type(d3.symbolDiamond).size(legendSize)();
                    } else if (d == NodeTypes.Wave) {
                        return d3.symbol().type(d3.symbolTriangle).size(legendSize)(d);
                    } else if (d == NodeTypes.Institution) {
                        return d3.symbol().type(d3.symbolCross).size(legendSize)(d);
                    } else if (d == NodeTypes.Country) {
                        return d3.symbol().type(d3.symbolTriangle2).size(legendSize)(d);
                    }
                })
                .style("fill", function (d) {
                    return nodeTypeColorScale(d)
                })
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("transform", (d, i) => {
                    // return `translate(${diameter / 2}, ${diameter / 2})`
                    return `translate(20, ${30 + i * 50})`
                })


            d3.select("#svg-legend")
                .selectAll("text")
                .data(Object.values(NodeTypes))
                .join("text")
                .text(d => d)
                .attr("transform", (d, i) => {
                    return `translate(30, ${35 + i * 50})`
                })


            // d3.select("#svgf")
            //     .selectAll("circle")
            //     .data(Object.values(NodeTypes))
            //     .join("circle")
            //     .attr("cx", 10)
            //     .attr("cy", 10)
            //     .attr("r", 5)

        }
    }

</script>

<div bind:this={element}>
<!--    Translate is ugly hack because netpan does not take all the width space -->
    <svg id="svg-legend" width={width} height={height} transform="translate(-200, 0)"></svg>
</div>

<style>
    div {
        /*flex-grow: 1;*/
        /*flex: 1;*/
        /*flex: 1 1 0;*/
        width: 8%;
    }
</style>