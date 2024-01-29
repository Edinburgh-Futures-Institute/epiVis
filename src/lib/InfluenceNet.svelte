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

    // console.log(33232, JSON.stringify(influenceLinks))

    let width: number;
    let height: number;

    const margin = 30;
    $: widthEff = width - 2 * margin;
    $: heightEff = height - 2 * margin;

    let element: HTMLElement;
    let svg: HTMLElement;
    let g: SVGElement;

    let papersIds = data.map(d => d["Epic Code "]);

    // We only have the ids for now
    let influencesIds = Object.values(paperToInfluences).reduce((a, b) => a.concat(b))
    influencesIds = [...new Set(influencesIds)].sort((p1, p2) => {
        return p1.year - p2.year;
    })


    onMount(() => {
        console.log("MOUNT")
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
            // console.log(22, link)
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
    }

    influenceNodes.filter(n => n);

    function render(width, height) {
        if (!svg) return;

        console.log(influencesIds)
        console.log(papersIds)

        var x = d3.scaleBand()
            .range([margin, widthEff])
            .domain(influencesIds)
            .padding(0.01);

        var y = d3.scaleBand()
            .range([heightEff, margin])
            // .domain(data.map(d => d["Epic Code "]))
            .domain(papersIds)
            .padding(0.01);

        d3.select(g).append("g").classed("axis", true)
            .attr("transform", "translate(0," + heightEff + ")")
            .call(d3.axisBottom(x)
                // .tickFormat((d, i) => i))
                .tickFormat((d, i) => ""))

        d3.select(g).append("g")
            .call(d3.axisLeft(y));

        // TODO: always same order of influences
        d3.select(g)
            .selectAll(".row")
            .data(data, d => d)
            .join("g")
            .classed("row", true)
            .selectAll("rect")
            // .data(d => allCols.map(col => [d["Epic Code "], d[col], col]))
            // .data(d => paperToInfluences[d["Epic Code "]])
            .data(d => influencesIds.map(influence => [influence, paperToInfluences[d["Epic Code "]], d["Epic Code "]]))
            .join("rect")
            .attr("x", function (d) {
                // console.log(d)
                return x(d[0])
            })
            .attr("y", function (d) {
                return y(d[2])
            })
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", function (d) {
                console.log(d)
                // if (d[1] && d[1].includes(d[0])) {
                if (d[1] && d[1].map(n => n.name).includes(d[0])) {
                    return "black"
                }
                return "white"
            })
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

