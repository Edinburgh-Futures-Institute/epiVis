<script lang="ts">
    import {authorsFilename, nodeTypeColorScale, NodeTypes, papersFilename} from "../dataLoader.ts";
    import {onMount} from "svelte";

    import * as d3 from "d3";

    export let selectedNodeTypes: NodeTypes[]
    export let selectedNet: string;

    let element: HTMLElement;
    let width: number = 180;
    let height: number = 600;
    const legendSize = 100;

    $: {
        d3.select("#svg-legend").html("")

        if (element && selectedNet) {
            d3.select("#svg-legend")
                .selectAll("path")
                .data(Object.values(NodeTypes))
                .join("path")
                .attr("d", d => {
                    if (d == NodeTypes.Person) {
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
                        return d3.symbol().type(d3.symbolTriangle).size(legendSize)(d);
                    } else if (d == NodeTypes.Model) {
                        return d3.symbol().type(d3.symbolStar).size(legendSize)(d);
                    }
                })
                .style("fill", function (d) {
                    return nodeTypeColorScale(d)
                })
                .style("stroke", "black")
                .style("stroke-width", 1)
                .attr("transform", (d, i) => {
                    // return `translate(${diameter / 2}, ${diameter / 2})`
                    return `translate(20, ${30 + i * 50}) ${(d == NodeTypes.Country) ? "rotate(-180)" : ""}`
                })

            d3.select("#svg-legend")
                .selectAll("text")
                .data(Object.values(NodeTypes))
                .join("text")
                .text(d => d)
                .attr("transform", (d, i) => {
                    return `translate(30, ${35 + i * 50})`
                })

            // d3.select(element)
            //     .selectAll("input")
            //     .data(Object.values(NodeTypes))
            //     .join("input")
            //     // .text(d => d)
            //     .style("position", "absolute")
            //     .attr("type", "checkbox")
            //     .attr("checked", "true")
            //     .style("top", (d, i) => `${20 + i * 50}px`)
            //     .style("left", (d, i) => "-190px")
            //     .on("click", (e, d) => {
            //         if (selectedNodeTypes.includes(d)) {
            //             selectedNodeTypes = selectedNodeTypes.filter(v => v != d)
            //         } else {
            //             selectedNodeTypes.push(d)
            //         }
            //         console.log(45555, selectedNodeTypes)
            //     })
        }
    }

</script>

<div bind:this={element}>
<!--    Translate is ugly hack because netpan does not take all the width space -->
    <svg id="svg-legend" width={width} height={height}></svg>
<!--    <svg id="svg-legend" width={width} height={height} transform="translate(-180, 0)"></svg>-->
</div>

<style>
    div {
        /*flex-grow: 1;*/
        /*flex: 1;*/
        /*flex: 1 1 0;*/
        width: 8%;
        z-index: 10;
        position: relative;
    }
</style>