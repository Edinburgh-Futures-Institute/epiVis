<script lang="ts">
    import * as d3 from "d3";
    import "d3-graphviz";

    import Dropdown from "./lib/Dropdown.svelte";

    import {
        data,
        nullOrNS,
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
    import NetworkLegend from "./lib/NetworkLegend.svelte";
    import Visualization from "./lib/Visualization.svelte";

    let element: HTMLElement;

    let allInstitutions = [...new Set(affiliationsTable.map(aff => aff["Affiliation code"]))]

    let allStrains = [...new Set(data.map(d => d["AI strain"]).flat().filter(d => !nullOrNS(d)))];
    allStrains = allStrains.filter(strain => strain.length < 20)

    let currentStrain: string;
    let currentInstitution: string;
    let currentModel: string;
    let currentYearMin = 0;
    let currentYearMax = 0;

    let viewer;

    let selectedNodeTypes = Object.values(NodeTypes);
    // let selectedVis = "Full";
    let selectedVis = "People";

    $: filteredData = filterData(currentStrain, currentInstitution, currentModel, currentYearMin, currentYearMax);

    function filterData(currentStrain, currentInstitution, currentModel, currentYearMin, currentYearMax) {
        let filtered: any[] = data

        if (currentInstitution) {
            filtered = filtered.filter(d => d["Affiliation of 1st author"] == currentInstitution);
        }

        if (currentStrain) {
            filtered = filtered.filter(d => {
                return d["AI strain"].includes(currentStrain)
            });
        }

        if (currentModel) {
            filtered = filtered.filter(d => {
                return d[MODEL].includes(currentModel)
            });
        }

        if (currentYearMin || currentYearMax) {
            filtered = filtered.filter(d => {
                if (!paperToTimes[d["Epic Code "]]) return false;

                let intervals = paperToTimes[d["Epic Code "]];

                if (currentYearMin && intervals[0][0] <= currentYearMin) return false;
                if (currentYearMax && intervals[intervals.length - 1][1] >= currentYearMax) return false;

                return true;
            });
        }


        // TODO: works but very hacky, check Netpan for better update of list/object parameters
        if (viewer) {
            let paperIds = filtered.map(d => d["Epic Code "]);
            let netpanNodes = viewer.state.network.nodes.filter(n => paperIds.includes(n.id));

            netpanNodes.forEach(n => {
                Object.keys(n).forEach((key) => !["data", "variable"].includes(key) || delete n[key]);
            })
            // viewer.setParam("node_selection", {nodes: netpanNodes.map(n => n.id), links: []})
            viewer.setParam("node_selection", {nodes: netpanNodes, links: []})
            // viewer.state.node_selection = {nodes: netpanNodes, links: []};
        }


        return filtered
    }



    async function render(element) {
        if (element) {
            // d3.select("#vis4")
            //     .graphviz()
            //     .renderDot(dotGraph());

            // d3.select("#vis4")
            //     .graphviz()
            //     .width(1400)
            //     .height(1000)
            //     .renderDot(dotGraphTime());
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
        <Visualization {filteredData}>
        </Visualization>
        <NetworkVis bind:selectedNodeTypes={selectedNodeTypes} bind:selectedNet="{selectedVis}" bind:viewer="{viewer}" specPath="/netpanorama-vis/templates/wholeNet.json">
        </NetworkVis>
        <NetworkLegend bind:selectedNodeTypes={selectedNodeTypes} selectedNet="{selectedVis}">
        </NetworkLegend>
    </div>

    <Table {filteredData}>
    </Table>

<!--        <Heatmap>-->
<!--        </Heatmap>-->

<!--        <Circular>-->
<!--        </Circular>-->

<!--        <Timevis>-->
<!--        </Timevis>-->

<!--        <div class="vis-container">-->
<!--            <div id="vis4" class="vis-component">-->
<!--            </div>-->
<!--        </div>-->

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
        row-gap: 1em;
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
        /*min-height: 100%;*/
        max-height: 140px;
        /*margin-right: 6%;*/
    }

    #header {
        display: flex;
        flex-direction: row;
        /*width: 70%;*/
        width: 100%;
        padding-top: 1em;
    }

    #menu {
        display: flex;
        flex-direction: row;
        width: 100%;
    }

    .main-component {
        /*padding-left: 40px;*/
        padding-top: 2em;
        padding-left: 2em;
        box-sizing: border-box;
    }


    #vis-div {
        display: flex;
        flex-direction: row;
        width: 100%;
        background-color: white;
        column-gap: 1%;
    }
</style>
