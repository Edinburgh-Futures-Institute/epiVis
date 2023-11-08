<script lang="ts">
    import * as d3 from "d3";

    import {onMount} from "svelte";
    import {affiliationsFilename, authorsPapaersFilename, papersFilename} from "../dataLoader.ts";

    // export let filteredData;

    let specPath = "../netpanorama-vis/templates/institutionProj.json"
    let width: number = 1200;
    let height: number = 600;

    let institutions;
    let links;

    let element: HTMLElement;
    let svg: HTMLElement;
    let colorScale = d3.scaleLinear([0, 10], ["white", "blue"]);

    onMount(() => {
        getNetpanNet().then(() => {
            render();
        })
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }

    async function getNetpanNet() {
        if (width && element) {
            console.log("RENDERRR")
            // element.innerHTML = ""

            let viewer = await NetPanoramaTemplateViewer.render(specPath, {
                affiliations: affiliationsFilename,
                width: width,
                height: height
            }, "affiliationNet");

            // institutions = viewer.state.networkAff.nodes
            institutions = viewer.state.network.nodes
            links = viewer.state.network.links
            // console.log(22222, viewer.state.network)
            // console.log(22222, viewer.state.network.nodes, links)
            // console.log(22222, viewer.state.network)
        }
    }

    function render(width, height) {
        if (!svg) return;
        console.log("RENDER ")

        institutions.sort((a, b) => {
            // return a.data["Country "] - b.data["Country "]
            return a.data["Country "].localeCompare(b.data["Country "])
        })

        // institutions = institutions.filter(i => i.data["Country "])

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

        console.log(countryToCount)




        const radialScale = d3.scaleLinear([0, pos], [0, Math.PI * 2])

        const countryColorScale = d3.scaleOrdinal(d3.schemeAccent)

        const distance = 300;


        const x = (d) => distance * Math.cos(radialScale(d.pos))
        const y = (d) => {
            return distance * Math.sin(radialScale(d.pos))
        }

        d3.select(svg)
            .selectAll(".node")
            .data(institutions)
            // .join("g")
            // .attr("transform", d => `rotate(${radialScale(d.pos) * 180 / Math.PI - 90}) translate(300,0)`)
            // .attr("transform", d => `translate(300,0)`)
            .join("circle")
            // .attr("dy", "0.31em")
            // .attr("cx", d => radialScale(d.pos) < Math.PI ? 6 : -6)
            .attr("cx", d => x(d))
            .attr("cy", d => y(d))
            .attr("r", 7)
            .attr("fill", d => countryColorScale(d.data["Country "]))
            // .attr("fill", d => "none")
            .attr("stroke", "black")
            .classed("node", true)
            // .attr("transform", d => `rotate(${radialScale(d.pos) * 180 / Math.PI}) translate(300,0)`)


        const pie = d3.pie().padAngle(0.05).sort(null).sortValues(null).startAngle(Math.PI / 2).endAngle(3 *Math.PI);
        const arc = d3.arc().innerRadius(distance + 40).outerRadius(distance + 40 + 50);

        const countries = d3.select(svg)
            .append("g")
      .attr("fill", "#ccc")
      .attr("stroke", "#000")
      .attr("stroke-width", "1.5px")
      .attr("stroke-linejoin", "round")
    .selectAll("path")
    .data(pie(Object.values(countryToCount)))
    .join("path")
      .attr("d", arc.cornerRadius(5));

    //     const line = d3.lineRadial()
    // .curve(d3.curveBundle.beta(0.85))
    // .radius(d => 200)
    // .angle(d => radialScale(d.pos));


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

            // .attr("fill", d => countryColorScale(d.data["Country "]))
            // .attr("transform", d => `rotate(${radialScale(d.pos) * 180 / Math.PI - 90}) translate(300,0)`)

        // let nodesById = new Map(institutions.map(node => [node.id, node]))
        //
        // let nodesp = new Map(
        //     links.map(
        //         (d) => {
        //             let source = d.source
        //             let targets = [d.target]
        //             let lado = d.parte
        //             let orden = d.num_edge
        //             return [source, {id: source, targetIds: targets, group: "main", order: orden}]
        //         }
        //     )
        // )
        //
        // let data = {name: "patterns", children: [...nodesp.values()]}
    }

    // $: render(width, height)
</script>

<div bind:this={element} on:resize={updateDimensions}>
    <svg bind:this={svg} width={width} height={width} viewBox="{-width / 2}, {-width / 2}, {width}, {width}">
<!--    <svg bind:this={svg} width={width} height={width}>-->
    </svg>
</div>
<div id="affiliationNet">
</div>


<style>
    div {
        /*flex-grow: 1;*/
        /*flex: 1;*/
        /*width: 0;*/
        width: 1000px;
        height: 1000px;
    }
</style>

