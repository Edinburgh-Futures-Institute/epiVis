<script lang="ts">
    import {authorsPapaersFilename, NodeTypes, papersFilename} from "../dataLoader.ts";
    import {onMount} from "svelte";

    // export let data;
    export let selectedNodeTypes;
    export let specPath;

    let element;
    let selectedNet;
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

    function render(width, height, selectedNodeTypes) {
        // console.log("NET DIM ", width, height)
        if (width) {
            element.innerHTML = ""


            console.log(selectedNodeTypes, 222)
            if (selectedNodeTypes[0] == NodeTypes.Person && selectedNodeTypes.length == 1) {
                console.log("PEOPLE")
                NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
                    filename: papersFilename,
                    authorsFilename: authorsPapaersFilename,
                    width: width,
                    height: height
                }, "vis");
            } else {
                NetPanoramaTemplateViewer.render(specPath, {
                    filename: papersFilename,
                    authorsFilename: authorsPapaersFilename,
                    width: width,
                    height: height
                }, "vis");
            }
        }
    }

    function selectTab(e) {
        console.log(222, e, e.target.value)
        selectedNet = e;
    }

    $: render(width, height, selectedNodeTypes);
</script>


<div id="mainDivNet">
    <div class="tab">
      <button class="tablinks" on:click={selectTab}>Full</button>
      <button class="tablinks" on:click={selectTab}>People</button>
      <button class="tablinks" on:click={selectTab}>Papers</button>
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