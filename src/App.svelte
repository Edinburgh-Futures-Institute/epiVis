<script lang="ts">
    import * as d3 from "d3";
    import "d3-graphviz";

    import Map from "./lib/Map.svelte";
    import Dropdown from "./lib/Dropdown.svelte";

    import {
        data,
        nullOrNS,
        allYears,
        yearMin,
        yearMax,
        paperToTimes,
        influenceNodes,
        influenceLinks,
        affIdToName,
        MODEL,
        MODELS,
        affiliationsTable,
        NodeTypes
    } from "./dataLoader.ts"
    import Table from "./lib/Table.svelte";
    import Time from "./lib/Time.svelte";
    import NetworkVis from "./lib/NetworkVis.svelte";
    import Timevis from "./lib/Timevis.svelte";
    import NetworkLegend from "./lib/NetworkLegend.svelte";
    import Circular from "./lib/Circular.svelte";
    import Heatmap from "./lib/Heatmap.svelte";
    import Visualization from "./lib/Visualization.svelte";

    let element: HTMLElement;

    // let allIstitutions = data.reduce((d0, d) => d0.concat(d["Affiliation of 1st author"].split(",").concat(d["Affiliation of 2nd author"].split(",")).concat(d["Affiliation of 3rd author"].split(",")).concat(d["Affiliation of Forth th author"].split(",").concat(d["Affiliation of Fifth th author"].split(",")))), [])
    // allIstitutions = [...new Set(allIstitutions)]
    let allInstitutions = [...new Set(affiliationsTable.map(aff => aff["Affiliation code"]))]


    // let allStrains = [...new Set(data.map(d => d["AI strain"]).filter(d => !nullOrNS(d)))];
    let allStrains = [...new Set(data.map(d => d["AI strain"]).flat().filter(d => !nullOrNS(d)))];
    let allModels = [...new Set(data.map(d => d [MODEL]))];

    let currentStrain;
    let currentInstitution;
    let currentModel;
    let currentYearMin = 0;
    let currentYearMax = 0;

    let selectedNodeTypes = Object.values(NodeTypes);


    $: filteredData = filterData(currentStrain, currentInstitution, currentModel, currentYearMin, currentYearMax);

    function filterData(currentStrain, currentInstitution, currentModel, currentYearMin, currentYearMax) {
        let filtered: any[] = data

        if (currentInstitution) {
            filtered = filtered.filter(d => d["Affiliation of 1st author"] == currentInstitution);
        }

        if (currentStrain) {
            filtered = filtered.filter(d => d["AI strain"].includes(currentStrain));
        }

        if (currentModel) {
            filtered = filtered.filter(d => d[MODEL] == currentModel);
        }

        if (currentYearMin || currentYearMax) {
            filtered = filtered.filter(d => {
                if (!paperToTimes[d["Epic Code "]]) return false;

                let intervals = paperToTimes[d["Epic Code "]];

                if (currentYearMin && intervals[0][0] < currentYearMin) return false;
                if (currentYearMax && intervals[intervals.length - 1][1] > currentYearMax) return false;

                return true;
            });
        }

        return filtered
    }

    function dotGraph() {
        let dot = "digraph { rankdir=LR;"

        let rankKey = "layer"

        let rankToNodesIds: Record<string, (string | number)[]> = {};
        influenceNodes.forEach(n => {
            const rank = n[rankKey]
            if (rankToNodesIds[rank]) {
                rankToNodesIds[rank].push(n.id)
            } else {
                rankToNodesIds[rank] = [n.id]
            }
        })

        for (let [rank, nodesIds] of Object.entries(rankToNodesIds)) {
            nodesIds = nodesIds.map(v => `"${v}"`)
            dot += `{rank=same; ${nodesIds.join(",")}}`
        }

        influenceLinks.forEach(link => {
            // const dotLink = `${link.source.id} -> ${link.target.id};`
            const dotLink = `"${link.source}" -> "${link.target}";`
            dot += dotLink
        })

        dot += "}";
        return dot
    }

    function dotGraphTime() {
        let dot = "digraph { rankdir=LR;"

        let rankKey = "layer"

        let rankToNodesIds: Record<string, (string | number)[]> = {};
        influenceNodes.forEach(n => {
            const rank = n[rankKey]
            if (rankToNodesIds[rank]) {
                rankToNodesIds[rank].push(n.id)
            } else {
                rankToNodesIds[rank] = [n.id]
            }
        })

        // console.log(22, rankToNodesIds)
        for (let [rank, nodesIds] of Object.entries(rankToNodesIds)) {
            nodesIds = nodesIds.map(v => `"${v}"`)
            dot += `{rank=same; ${rank}, ${nodesIds.join(",")}}`
        }

        // dot += "\n"

        influenceLinks.forEach(link => {
            let type = (link.influenceType == 1) ? "solid" : "dotted";
            const dotLink = `"${link.source}" -> "${link.target}" [style="${type}"];`;
            dot += dotLink
        })

        let ranks = Object.keys(rankToNodesIds);
        for (let i = 0; i < ranks.length - 2; i++) {
            let r = ranks[i];
            let r2 = ranks[i + 1];
            dot += `${r} -> ${r2};`
        }

        dot += "}";
        return dot
    }

    async function render(element) {
        if (element) {
            // await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/wholeNet.json", {
            //     filename: papersFilename,
            // }, "vis1");

            // let projPerson = await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
            //     filename: papersFilename,
            //     authorsFilename: authorsPapaersFilename,
            // }, "vis2");

            // NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/PaperInfluence.json", {
            //     filename: papersFilename,
            // }, "vis3");

            // console.log(333, JSON.stringify(influenceNodes2))
            // let view = await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/PaperInfluenceTime.json", {
            //     nodes: influenceNodes,
            //     links: influenceLinks,
            // }, "vis4");

            // d3.select("#vis4")
            //     .graphviz()
            //     .renderDot(dotGraph());

            d3.select("#vis4")
                .graphviz()
                .width(1800)
                .height(1000)
                .renderDot(dotGraphTime());
        }
    }

    $: render(element);
</script>

<main bind:this={element}>
    <div id="header" class="main-component">
        <div id="title">
            <img id="title-img" src="./title.png">
        </div>
        <div id="control">
            <div id="control-title" class="title">
                General Search & Filters:
            </div>
            <div id="menu">
                <Dropdown name="Strains" bind:value={currentStrain} allValues={allStrains} table={undefined}>
                </Dropdown>
                <Dropdown name="Institutions" bind:value={currentInstitution} allValues={allInstitutions} table={affIdToName}>
                    <!--        <Dropdown name="Institutions" bind:value={currentInstitution} allValues={allIstitutions}>-->
                </Dropdown>
                <Dropdown name="Model Types" bind:value={currentModel} allValues={Object.keys(MODELS)} table={MODELS}>
                </Dropdown>
                <Time {filteredData} {yearMin} {yearMax} bind:currentYearMin={currentYearMin} bind:currentYearMax={currentYearMax}>
                </Time>
            </div>
        </div>
    </div>

    <div id="vis-div" class="main-component">
<!--        <Map {filteredData}>-->
<!--        </Map>-->
        <Visualization {filteredData}>
        </Visualization>

<!--            <NetworkVis bind:selectedNodeTypes={selectedNodeTypes} specPath="../netpanorama-vis/templates/wholeNet.json">-->
        <NetworkVis bind:selectedNodeTypes={selectedNodeTypes} specPath="/netpanorama-vis/templates/wholeNet.json">
        </NetworkVis>
        <NetworkLegend bind:selectedNodeTypes={selectedNodeTypes}>
        </NetworkLegend>
    </div>

    <Table {filteredData}>
        </Table>

<!--        <Heatmap>-->
<!--        </Heatmap>-->

<!--        <Circular>-->
<!--        </Circular>-->

        <Timevis>
        </Timevis>

        <div class="vis-container">
            <div id="vis4" class="vis-component">
            </div>
        </div>

</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        /*width: 100vw;*/
        align-items: center;
        justify-content: center;
        /*justify-content: space-between;*/
        /*margin-left: 300px;*/
        /*margin-right: 300px;*/
        /*padding: 1em;*/
        row-gap: 2em;
    }



    #title {
        /*margin-right: 6%;*/
        /*width: 500px;*/
        width: 20%;
    }

    #title-img {
        /*max-width: 100%;*/
        /*max-height: 100%;*/
        /*min-width: 100%;*/
        min-height: 100%;
        /*margin-right: 6%;*/
    }

    #header {
        display: flex;
        flex-direction: row;
        /*width: 70%;*/
        width: 100%;
    }

    #menu {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    #vis-div {
        display: flex;
        flex-direction: row;
        width: 100%;
        background-color: white;
        column-gap: 3%;
    }

    .vis-component {
        /*display: inline-block;*/
        /*width: 40vw;*/
        /*width: 40vw;*/
        height: 100vh;
    }
</style>
