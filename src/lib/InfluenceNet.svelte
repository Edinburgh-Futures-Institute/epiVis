<script lang="ts">
    import * as d3 from "d3";
    import * as reorder from "reorder.js";

    import {onMount} from "svelte";
    import {
        allCols, data,
        influenceLinks,
        influenceNodes,
        paperToInfluences,
        paperAffiliationTable
    } from "../dataLoader.ts";
    import {paperIdTopaperObject} from "../dataLoader.js";

    let width: number;
    let height: number;

    const margin = 30;
    $: widthEff = width - 2 * margin;
    $: heightEff = height - 2 * margin;

    let element: HTMLElement;
    let tooltip: HTMLElement;
    let svg: HTMLElement;
    let g: SVGElement;

    let papersIds = data.map(d => d["Epic Code "]);

    let influencesIds = Object.values(paperToInfluences).reduce((a, b) => a.concat(b))
    influencesIds = [...new Set(influencesIds)].sort((p1, p2) => {
        return p1.year - p2.year;
    })

    let papersFirstyear = [];

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
        let indexToNodeId = {};
        let idToNodeIndex = {};
        influenceNodes.forEach((n, i) => {
            indexToNodeId[i] = n.id
            idToNodeIndex[n.id] = i
            n.id = i;
        })

        influenceLinks.forEach(link => {
            link.source = idToNodeIndex[link.source]
            link.target = idToNodeIndex[link.target]
        })

        const graph = reorder.graph(influenceNodes, influenceLinks, true).init();

        // const initial_crossings = reorder.count_crossings(graph);
        const perms = reorder.barycenter_order(graph);
        // const perms2 = reorder.adjacent_exchange(graph, perms[0], perms[1]);
        // console.log(perms[0], perms[1]);
        // console.log(perms2);

        papersIds = perms[0].map(n => indexToNodeId[n])
        influencesIds = perms[1].map(n => indexToNodeId[n])

        influencesIds.sort((p1, p2) => {
            return paperIdTopaperObject[p1].year - paperIdTopaperObject[p2].year;
        })


        let year0 = null;
        influencesIds.forEach(paper => {
            let year1 = paperIdTopaperObject[paper].year
            if (year1 != year0) {
                papersFirstyear.push(paper);
                year0 = year1;
            }
        })
    }

    // influenceNodes.filter(n => n);

    function render(width, height) {
        if (!svg) return;

        var x = d3.scaleBand()
            .range([0, width])
            .domain(influencesIds)
            .paddingInner(0.25)

        var y = d3.scaleBand()
            .range([heightEff - 5, margin])
            .domain(papersIds)
            .paddingInner(0.5)

        d3.select(g).append("g").classed("axis", true)
            .attr("transform", "translate(0," + heightEff + ")")
            .call(d3.axisBottom(x)
                // .tickFormat((d, i) => i))
                .tickFormat((d, i) => ""))

        // Add event listeners to show/hide tooltips
          d3.select(g).selectAll(".tick")
            .on("mouseover", function(e, d, i) {
              d3.select(tooltip).transition()
                .style("opacity", 1);
              d3.select(tooltip).html(d)
                .style("left", (e.pageX - element.offsetLeft) + "px")
                .style("top", e.pageY - (element.getBoundingClientRect().top + window.pageYOffset) + "px")
            })
            .on("mouseout", function() {
              d3.select(tooltip).transition()
                .style("opacity", 0);
            });

        d3.select(g).selectAll(".tick line")
            .attr("stroke-width", 2)


        // Add time labels
        d3.select(g).selectAll(".tick")
            .append("text")
            .text(d => {
                if (papersFirstyear.includes(d)) {
                    return paperIdTopaperObject[d].year
                }
            })
            .attr("fill", "black")
            // .attr("x", d => {})
            .attr("y", d => {
                if (papersFirstyear.indexOf(d) % 2 == 0) {
                    return 15
                } else {
                    return 30
                }
            })

        d3.select(g).append("g")
            .call(d3.axisLeft(y));

        // TODO: always same order of influences
        d3.select(g)
            .selectAll(".row")
            .data(data, d => d)
            .join("g")
            .classed("row", true)
            .selectAll("rect")
            .data(d => influencesIds.map(influence => [influence, paperToInfluences[d["Epic Code "]], d["Epic Code "]]))
            .join("rect")
            .attr("x", function (d) {
                return x(d[0])
            })
            .attr("y", function (d) {
                return y(d[2])
            })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                if (d[1] && d[1].map(n => n.name).includes(d[0])) {
                // if (d[1] && d[1].includes(d[0])) {
                    return "black"
                }
                return "white"
            })
    }

    // $: render(width, height)
</script>

<div id="influence-div" bind:this={element} on:resize={updateDimensions}>
    <div bind:this={tooltip} id="influence-tooltip">TEST</div>
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

    #influence-tooltip {
      position: absolute;
      background-color: #f8f9fa;
      padding: 8px;
      border: 1px solid #ced4da;
      border-radius: 4px;
      pointer-events: none;
      opacity: 0;
    }
</style>

