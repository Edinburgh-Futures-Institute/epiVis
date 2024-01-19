
<script lang="ts">
    import * as d3 from "d3";
    import * as reorder from "reorder.js";

    import {onMount} from "svelte";
    import {
        affiliationsFilename,
        allCols, data,
        influenceLinks,
        influenceNodes,
        paperToInfluences,
        paperAffiliationTable
    } from "../dataLoader.ts";

    let width: number;
    let height: number;

    const margin = 30;
    $: widthEff = width - 2 * margin;
    $: heightEff = height - 2 * margin;

    let legendWidth = 10;
    let legendHeight = 10;

    let element: HTMLElement;
    let svg: HTMLElement;
    let g: SVGElement;
    let svgLegend: SVGElement;

    onMount(() => {
        updateDimensions();
        getNet().then(() => {
            render(width, height);
        })
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        // width = rect.width - legendWidth - 200;
        width = rect.width;
        height = rect.height;
    }

    async function getNet() {
        let papers = data;
        let papersIds = data.map(d => d["Epic Code "]);

        // We only have the ids for now
        let influencesIds = Object.values(paperToInfluences).reduce((a, b) => a.concat(b))
        influencesIds = [...new Set(influencesIds)]
        console.log(222, influencesIds)

        // let indexToNodeId = {};
        // let idToNodeIndex = {};
        // influenceNodes.forEach((n, i) => {
        //     indexToNodeId[i] = n.id
        //     idToNodeIndex[n.id] = i
        //
        //     n.id = i;
        // })
        //
        // influenceLinks.forEach(link => {
        //     link.source = idToNodeIndex[link.source]
        //     link.target = idToNodeIndex[link.target]
        // })

        // console.log(influenceNodes);
        // console.log(influenceLinks);

        // const graph = reorder.graph().nodes(influenceNodes).links(influenceLinks).init();
        // console.log(graph.nodes());

        // const initial_crossings = reorder.count_crossings(graph);
        // const perms = reorder.barycenter_order(graph);
        // const perms2 = reorder.adjacent_exchange(graph, perms[0], perms[1]);
        // console.log(perms);
        // console.log(perms);
    }

    function render(width, height) {
        if (!svg) return;

        var x = d3.scaleBand()
            .range([margin, widthEff])
            .domain(allCols)
            .padding(0.01);

// Build X scales and axis:
        var y = d3.scaleBand()
            .range([heightEff, margin])
            .domain(data.map(d => d["Epic Code "]))
            .padding(0.01);

        d3.select(g).append("g").classed("axis", true)
            .attr("transform", "translate(0," + heightEff + ")")
            .call(d3.axisBottom(x))

         d3.select(g).append("g")
        .call(d3.axisLeft(y));


        d3.select(g)
            .selectAll(".row")
          .data(data, d => d)
          .join("g")
          .classed("row", true)
             .selectAll("rect")
             .data(d => allCols.map(col => [d["Epic Code "], d[col], col]))
             .join("rect")
          .attr("x", function(d) {
              return x(d[2]) })
          .attr("y", function(d) { return y(d[0]) })
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) {
              if (d[1] == "Y" || d[1] == "P" || d[1] == "S") {
                  return "#a6d96a"
              } else if (d[1] == "N" || d[1] == "I") {
                  return "#f46d43"
              } else if (d[1] == "M" || d[1] == "L") {
                  return "#fee08b"
              }
          } )




    }


    // $: render(width, height)
</script>

<div id="influence-div" bind:this={element} on:resize={updateDimensions}>
    <svg bind:this={svg} width={width} height={width}>
        <g bind:this={g} transform="translate({margin}, {margin})"></g>
    </svg>
</div>


<style>
    #influence-div {
        /*justify-content: center;*/
        /*align-items: center;*/
        width: 100%;
        height: 100%;
    }

    /*svg {*/
    /*    display: inline-block;*/
    /*    vertical-align: top;*/
    /*}*/
</style>

