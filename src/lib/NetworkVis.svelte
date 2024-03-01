<script lang="ts">
    import {
        affiliationsTable,
        authorsFilename,
        countryToCountryTable,
        institutionModelTable, modelTable, paperModelTable,
        papersFilename, paperWaveTable, strainWaveTable, waveCountryTable
    } from "../dataLoader.ts";
    import {onMount} from "svelte";
    import {GRAY} from "../globals.ts";
    import CircularInst from "./CircularInst.svelte";
    import CircularAff from "./CircularAff.svelte";
    import Helper from "./Helper.svelte";

    export let selectedNodeTypes;
    export let specPath;
    export let selectedNet;
    export let viewer;

    let element: HTMLElement;

    let elementNet: HTMLElement;
    // let selectedNet = "Institutions";
    let width: number;
    let height: number;

    const fullNetPath = "./netpanorama-vis/templates/wholeNet.json"
    const peopleNetPath = "./netpanorama-vis/templates/projPerson.json"
    const countryProjNetPath = "/netpanorama-vis/templates/countryProj.json"
    const instModelNetPath = "/netpanorama-vis/templates/institutionModel.json"

    onMount(() => {
        updateDimensions();
        // render(width, height)
    })

    function updateDimensions() {
        const rect = elementNet.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }

    async function render(width, height, networkName) {
        // if (width && height) {
        if (elementNet) {
            elementNet.innerHTML = ""
            let margin = 120;

            if (networkName == "Full") {
                viewer = await NetPanoramaTemplateViewer.render(fullNetPath, {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width - margin,
                    height: height - margin,
                    strokeColor: GRAY,
                    strainWavesLinks: strainWaveTable,
                    wavePapersLinks: paperWaveTable,
                    waveCountryLinks: waveCountryTable,
                    modelPapersLinks: paperModelTable
                }, "vis");

            } else if (networkName == "People") {
                viewer = await NetPanoramaTemplateViewer.render(peopleNetPath, {
                    filename: papersFilename,
                    strokeColor: GRAY,
                    authorsFilename: authorsFilename,
                    width: width,
                    height: height - margin
                }, "vis");
            } else if (networkName == "Countries") {
                viewer = NetPanoramaTemplateViewer.render(countryProjNetPath, {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width,
                    height: height - margin,
                    links: countryToCountryTable
                }, "vis");
            } else if (networkName == "Models+Institutions") {
                viewer = NetPanoramaTemplateViewer.render(instModelNetPath, {
                    data: institutionModelTable,
                    modelTable: modelTable,
                    affTable: affiliationsTable,
                    strokeColor: GRAY,
                    width: width,
                    height: height - margin
                }, "vis");
            } else if (networkName == "Institutions") {
                //
            }
        }
    }

    function selectTab(e) {
        selectedNet = e.target.textContent;
    }

    $: render(width, height, selectedNet);
</script>


<div id="mainDivNet" bind:this={element}>
    <div class="tab">
        <span class="title"> Visualization Type 2 </span>

        <button class="tablinks" on:click={selectTab}>Full</button>
        <button class="tablinks" on:click={selectTab}>People</button>
<!--        <button class="tablinks" on:click={selectTab}>Countries</button>-->
        <button class="tablinks" on:click={selectTab}>Models+Institutions</button>
        <button class="tablinks" on:click={selectTab}>Institutions</button>
        <button class="tablinks" on:click={selectTab}>Affiliations</button>
    </div>

    <div id="vis" bind:this={elementNet} on:resize={updateDimensions}>
        {#if selectedNet == "Institutions"}
            <CircularInst>
            </CircularInst>
        {:else if selectedNet == "Affiliations"}
            <CircularAff>
            </CircularAff>
        <!--{:else}-->
    <!--        <div id="vis" bind:this={elementNet} on:resize={updateDimensions}>-->
        {/if}
    </div>

    <Helper visualizationType="{selectedNet}" parentEl="{element}"></Helper>

    <!--<div id="vis" class="vis-frame" bind:this={elementNet}>-->
</div>

<style>
    #mainDivNet {
        /*width: 200px;*/
        /*flex: 1 1 0;*/
        /*flex: 0 0 auto;*/
        flex-basis: 0;
        flex-grow: 2;

        width: 0;

        position: relative;
    }

    #vis {
        /*width: 100%;*/
        width: 90%;
        /*height: 90%;*/
        height: 72vh;
    }
</style>