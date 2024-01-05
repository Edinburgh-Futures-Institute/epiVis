<script lang="ts">
    import {
        affiliationsFilename,
        authorsFilename,
        countryToCountryTable,
        institutionModelTable,
        NodeTypes,
        papersFilename, paperWaveTable, strainWaveTable, waveCountryTable
    } from "../dataLoader.ts";
    import {onMount} from "svelte";
    import {GRAY} from "../globals.ts";
    import Circular2 from "./Circular2.svelte";
    import Helper from "./Helper.svelte";

    export let selectedNodeTypes;
    export let specPath;


    let element: HTMLElement;
    let elementNet: HTMLElement;

    // let selectedNet = "Institutions";
    let selectedNet = "Full";
    let width: number;
    let height: number;

    const fullNetPath = "/netpanorama-vis/templates/wholeNet.json"
    const peopleNetPath = "/netpanorama-vis/templates/projPerson.json"
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

    // function render(width, height, selectedNodeTypes) {
    //     // console.log("NET DIM ", width, height)
    //     if (width) {
    //         element.innerHTML = ""
    //
    //         console.log(selectedNodeTypes, 222)
    //         if (selectedNodeTypes[0] == NodeTypes.Person && selectedNodeTypes.length == 1) {
    //             console.log("PEOPLE")
    //             NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
    //                 filename: papersFilename,
    //                 authorsFilename: authorsPapaersFilename,
    //                 width: width,
    //                 height: height
    //             }, "vis");
    //         } else {
    //             NetPanoramaTemplateViewer.render(specPath, {
    //                 filename: papersFilename,
    //                 authorsFilename: authorsPapaersFilename,
    //                 width: width,
    //                 height: height
    //             }, "vis");
    //         }
    //     }
    // }

    async function render(width, height, networkName) {
        // if (width && height) {
        if (elementNet) {
            elementNet.innerHTML = ""

            let margin = 120;

            if (networkName == "Full") {
                NetPanoramaTemplateViewer.render(fullNetPath, {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width - margin,
                    height: height - margin,
                    strokeColor: GRAY,
                    strainWavesLinks: strainWaveTable,
                    wavePapersLinks: paperWaveTable,
                    waveCountryLinks: waveCountryTable
                }, "vis");

            } else if (networkName == "People") {
                NetPanoramaTemplateViewer.render(peopleNetPath, {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width,
                    height: height - margin
                }, "vis");
            } else if (networkName == "Countries") {
                NetPanoramaTemplateViewer.render(countryProjNetPath, {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width,
                    height: height - margin,
                    links: countryToCountryTable
                }, "vis");

            } else if (networkName == "Models+Institutions") {
                await NetPanoramaTemplateViewer.render(instModelNetPath, {
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
        <span class="title"> Visualization 2 </span>

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

    <Helper visualizationType="{selectedNet}"></Helper>

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
        height: 65vh;
    }
</style>