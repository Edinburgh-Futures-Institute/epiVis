<script lang="ts">
    import {authorsPapaersFilename, NodeTypes, papersFilename} from "../dataLoader.ts";
    import {onMount} from "svelte";

    // export let data;
    export let selectedNodeTypes;
    export let specPath;

    let element;
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

    $: render(width, height, selectedNodeTypes);
</script>

<div id="vis" bind:this={element} on:resize={updateDimensions}>
</div>

<style>
    div {
        /*flex-grow: 1;*/
        /*flex: 1;*/
        flex: 1 1 0;
    }
</style>