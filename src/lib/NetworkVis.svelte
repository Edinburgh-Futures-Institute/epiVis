<script lang="ts">
    import {
        affiliationsFilename,
        authorsFilename,
        countryToCountryTable,
        institutionModelTable,
        NodeTypes,
        papersFilename
    } from "../dataLoader.ts";
    import {onMount} from "svelte";
    import {GRAY} from "../globals.ts";
    import Circular2 from "./Circular2.svelte";

    export let selectedNodeTypes;
    export let specPath;


    let element: HTMLElement;
    let elementNet: HTMLElement;

    let selectedNet = "Full";
    // let selectedNet = "Countries";
    let width: number;
    let height: number;

    const fullNetPath = "/netpanorama-vis/templates/wholeNet.json"

    onMount(() => {
        updateDimensions();
        // render(width, height)
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
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

        console.log(121, elementNet)

        if (elementNet) {
            elementNet.innerHTML = ""

            let margin = 100;

            if (networkName == "Full") {
                NetPanoramaTemplateViewer.render(fullNetPath, {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width - margin,
                    height: height - margin,
                    strokeColor: GRAY
                }, "vis");

            } else if (networkName == "People") {
                NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width,
                    height: height
                }, "vis");
            } else if (networkName == "Countries") {
                let viewer = await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/countryProj.json", {
                    filename: papersFilename,
                    authorsFilename: authorsFilename,
                    width: width,
                    height: height,
                    links: countryToCountryTable
                }, "vis");

            } else if (networkName == "Models+Institutions") {
                let viewer = await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/institutionModel.json", {
                    data: institutionModelTable,
                    width: width,
                    height: height
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


<div id="mainDivNet" bind:this={element} on:resize={updateDimensions}>
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

    <div id="vis" class="vis-frame" bind:this={elementNet}>
    {#if selectedNet == "Institutions"}
	    <Circular2>
        </Circular2>
    {:else}
<!--        <div id="vis" class="vis-frame" bind:this={elementNet}>-->
    {/if}
    </div>


    <!--<div id="vis" class="vis-frame" bind:this={elementNet}>-->

</div>

<style>
    #mainDivNet {
        /*flex: 1 1 0;*/
    }

    #vis {
        width: 100%;
        height: 95%;
        /*height: 200px;*/
        /*background-color: white;*/
    }
</style>