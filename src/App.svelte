<script lang="ts">
    import * as d3 from "d3";
    import "d3-graphviz";

    import Map from "./lib/Map.svelte";
    import Dropdown from "./lib/Dropdown.svelte";

    import {
        data,
        papersFilename,
        affiliationsFilename,
        nullOrNS,
        allYears,
        yearMin,
        yearMax,
        paperToTimes, influenceNodes, influenceLinks
    } from "./dataLoader.ts"
    import Table from "./lib/Table.svelte";
    import Time from "./lib/Time.svelte";

    // Column names
    let modelCN = "Model types (=school of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic, 4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Statistical 6.Qualitative 7. Phylogenetic "
    // let modelCN = "Model types (=school of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic - Bayesian  4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Other Statistical (non stochastic) 6.Qualitative 7. Phylogenetic 8. Simulation"

    let allIstitutions = data.reduce((d0, d) => d0.concat(d["Affiliation of 1st author"].split(",").concat(d["Affiliation of 2nd author"].split(",")).concat(d["Affiliation of 3rd author"].split(",")).concat(d["Affiliation of Forth th author"].split(",").concat(d["Affiliation of Fifth th author"].split(",")))), [])
    allIstitutions = [...new Set(allIstitutions)]
    // let allStrains = [...new Set(data.map(d => d["AI strain"]))];
    let allStrains = [...new Set(data.map(d => d["AI strain"]).filter(d => !nullOrNS(d)))];
    let allModels = [...new Set(data.map(d => d [modelCN]))];

    let currentStrain;
    let currentInstitution;
    let currentModel;
    let currentYearMin = 0;
    let currentYearMax = 0;

    // let allYears = []
    // for (let d of data) {
    //     let time = d["Period of study (in format for visualisations)"]
    //     let [y1, y2] = time.split("-")
    //     console.log(y1, y2)
    //
    //     if (!isNaN(y1) && y1 != "") allYears.push(parseInt(y1));
    //     if (!isNaN(y2) && y2 != "") allYears.push(parseInt(y2));
    // }
    // let [yearMin, yearMax] = d3.extent(allYears);
    // console.log(11111, yearMin, yearMax, allYears)


    $: filteredData = filterData(currentStrain, currentInstitution, currentModel, currentYearMin, currentYearMax);

    function filterData(currentStrain, currentInstitution, currentModel, currentYearMin, currentYearMax) {
        let filtered: any[] = data
        if (currentInstitution) {
            filtered = filtered.filter(d => d["Affiliation of 1st author"] == currentInstitution);
        }

        if (currentStrain) {
            filtered = filtered.filter(d => d["AI strain"] == currentStrain);
        }

        if (currentModel) {
            filtered = filtered.filter(d => d[modelCN] == currentModel);
        }

        if (currentYearMin || currentYearMax) {
            filtered = filtered.filter(d => {
                if (!paperToTimes[d["Epic Code "]]) return false;

                let intervals = paperToTimes[d["Epic Code "]];

                // console.log(intervals, paperToTimes, d, paperToTimes[d["Epic Code "])

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
        // console.log(dot)
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
            const dotLink = `"${link.source}" -> "${link.target}";`
            dot += dotLink
        })

        let ranks = Object.keys(rankToNodesIds);
        for (let i = 0; i < ranks.length - 2; i++) {
            let r = ranks[i];
            let r2 = ranks[i + 1];
            dot += `${r} -> ${r2};`
        }

        dot += "}";
        console.log(dot)
        return dot
    }

    async function render() {
        await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/wholeNet.json", {
            filename: papersFilename,
        }, "vis1");

        let projPerson = await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
            filename: papersFilename,
        }, "vis2");

        window.viewer = projPerson
        console.log(22, projPerson)


        NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/PaperInfluence.json", {
            filename: papersFilename,
        }, "vis3");

        // console.log(influenceNodes, influenceLinks)
        let influenceNodes2 = [{id: 1}, {id: 2}, {id: 3}]
        let influenceLinks2 = [{source: 1, target: 2}, {source: 3, target: 2}]
        NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/PaperInfluenceTime.json", {
            nodes: `${influenceNodes2}`,
            links: `${influenceLinks2}`,
        }, "vis4");

        // d3.select("#vis4")
        //     .graphviz()
        //     .renderDot(dotGraph());

        // d3.select("#vis4")
        //     .graphviz()
        //     .renderDot(dotGraphTime());
    }

    render();
</script>

<main>
    <Dropdown name="Strains" bind:value={currentStrain} allValues={allStrains}>
    </Dropdown>
    <Dropdown name="Institutions" bind:value={currentInstitution} allValues={allIstitutions}>
    </Dropdown>
    <Dropdown name="Model Types" bind:value={currentModel} allValues={allModels}>
    </Dropdown>
    <Time {filteredData} {yearMin} {yearMax} bind:currentYearMin={currentYearMin} bind:currentYearMax={currentYearMax}>
    </Time>

    <div id="main-div">

        <div id="vis-div">
            <Map {filteredData}>
            </Map>
            <Table {filteredData}>
            </Table>
        </div>

        <div class="vis-container">
            <div id="vis1" class="vis-component">
            </div>
        </div>

        <div class="vis-container">
            <div id="vis2" class="vis-component">
            </div>
        </div>

        <div class="vis-container">
            <div id="vis3" class="vis-component">
            </div>
        </div>

        <div class="vis-container">
            <div id="vis4" class="vis-component">
            </div>
        </div>
    </div>
</main>

<style>


    main {
        display: flex;
        flex-direction: column;
        /*margin-right: 10%;*/
        /*margin-left: 10%;*/
        /*width: 100vw;*/
        align-items: center;
        justify-content: center;
    }


    /*#main-div {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/
    /*    !*margin: 0;*!*/
    /*    !*width: 100vw;*!*/
    /*}*/

    /*#vis-div {*/
    /*    display: flex;*/
    /*    flex-direction: row;*/
    /*    !*margin: 0;*!*/
    /*    width: 100vw;*/

    /*}*/


    /*vis-container {*/
    /*    min-height: 50vh;*/
    /*!*display: inline-block;*!*/
    /*}*/

    .vis-component {
        /*display: inline-block;*/
        /*width: 40vw;*/
        /*width: 40vw;*/
        height: 100vh;
    }


</style>
