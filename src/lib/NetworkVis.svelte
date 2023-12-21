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

    // export let data;
    export let selectedNodeTypes;
    export let specPath;


    let element;
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
        if (width && height) {
            element.innerHTML = ""
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
            }
        }
    }

    function selectTab(e) {
        selectedNet = e.target.textContent;
    }

    $: render(width, height, selectedNet);
</script>


<div id="mainDivNet">
    <div class="tab">
        <button class="tablinks" on:click={selectTab}>Full</button>
        <button class="tablinks" on:click={selectTab}>People</button>
        <button class="tablinks" on:click={selectTab}>Countries</button>
        <button class="tablinks" on:click={selectTab}>Models+Institutions</button>
    </div>
    <div id="vis" bind:this={element} on:resize={updateDimensions}>
    </div>
</div>

<style>
    #mainDivNet {
        flex: 1 1 0;
    }

    #vis {
        width: 100%;
        height: 100%;
    }

    /*div {*/
    /*    flex: 1 1 0;*/
    /*}*/
</style>