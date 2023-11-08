<script lang="ts">
    import {authorsPapaersFilename, NodeTypes, papersFilename} from "../dataLoader.ts";
    import {onMount} from "svelte";

    // export let data;
    export let selectedNodeTypes;
    export let specPath;

    let element;
    let selectedNet = "Full";
    let width: number;
    let height: number = 600;

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

    function render(width, height, networkName) {
        // console.log("NET DIM ", width, height)
        if (width) {
            element.innerHTML = ""

            if (networkName == "Full") {
                NetPanoramaTemplateViewer.render(specPath, {
                    filename: papersFilename,
                    authorsFilename: authorsPapaersFilename,
                    width: width,
                    height: height
                }, "vis");
            } else if (networkName == "People") {
                NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
                    filename: papersFilename,
                    authorsFilename: authorsPapaersFilename,
                    width: width,
                    height: height
                }, "vis");
            } else if (networkName == "Countries") {
                NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/countryProj.json", {
                    filename: papersFilename,
                    authorsFilename: authorsPapaersFilename,
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
    // $: render(width, height, selectedNodeTypes);
</script>


<div id="mainDivNet">
    <div class="tab">
        <button class="tablinks" on:click={selectTab}>Full</button>
        <button class="tablinks" on:click={selectTab}>People</button>
        <button class="tablinks" on:click={selectTab}>Countries</button>
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