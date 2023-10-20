<script lang="ts">
    import {authorsPapaersFilename, papersFilename} from "../dataLoader.ts";
    import {onMount} from "svelte";

    // export let data;
    export let specPath;

    let element;
    let width: number;
    let height: number = 600;

    onMount(() => {
        updateDimensions();
        render(width, height)
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        console.log(333, width, height)
    }

    function render(width, height) {
        console.log(222222, width, height)
        NetPanoramaTemplateViewer.render(specPath, {
            filename: papersFilename,
            authorsFilename: authorsPapaersFilename,
            width: width,
            height: height
        }, "vis");
    }

    // $: render(width, height)
</script>

<div id="vis" bind:this={element} on:resize={updateDimensions}>
</div>

<style>
    div {
        /*flex-grow: 1;*/
        flex: 1;
    }
</style>