<script lang="ts">
    import {
        authorsFilename,
        countryToCountryTable,
        institutionModelTable, paperModelTable,
        papersFilename, paperWaveTable, strainWaveTable, waveCountryTable
    } from "../dataLoader.ts";
    import {onMount} from "svelte";
    import {GRAY} from "../globals.ts";
    import Circular2 from "./Circular2.svelte";
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
                    width: width,
                    height: height - margin
                }, "vis");
            } else if (networkName == "Institutions") {


            }
        }
    }

    function selectTab(e) {
        selectedNet = e.target.textContent;
    }

    $: render(width, height, selectedNet);
</script>


<div id="mainDivNet" bind:this={element}>
<!--    <div class="title">-->
<!--        Visualization 2-->
<!--    </div>-->
    <div class="tab">
        <span class="title"> Visualization Type 2 </span>

        <button class="tablinks" on:click={selectTab}>Full</button>
        <button class="tablinks" on:click={selectTab}>People</button>
        <button class="tablinks" on:click={selectTab}>Countries</button>
        <button class="tablinks" on:click={selectTab}>Models+Institutions</button>
        <button class="tablinks" on:click={selectTab}>Institutions</button>
    </div>

    <div id="vis" bind:this={elementNet} on:resize={updateDimensions}>
    {#if selectedNet == "Institutions"}
	    <Circular2>
        </Circular2>
    <!--{:else}-->
<!--        <div id="vis" class="vis-frame" bind:this={elementNet}>-->
    {/if}
    </div>

    <Helper visualizationType="{selectedNet}" parentEl="{element}"></Helper>

    <!--<div id="vis" class="vis-frame" bind:this={elementNet}>-->
</div>

<style>
    #mainDivNet {
        flex: 1 1 0;
        position: relative;
    }

    #vis {
        width: 100%;
        /*height: 90%;*/
        height: 72vh;
    }
</style>