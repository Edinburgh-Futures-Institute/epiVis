<script lang="ts">
    import * as d3 from "d3";

    import Map2 from "./Map2.svelte";
    import Timevis from "./Timevis.svelte";
    import Helper from "./Helper.svelte";
    import Heatmap from "./Heatmap.svelte";

    export let filteredData;

    let width: number;
    let height: number;

    let element: HTMLElement;
    let selectedVis = "Map";

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
    }

    function selectTab(e) {
        selectedVis = e.target.textContent;
    }

</script>

<div id="main-div" bind:this={element} on:resize={updateDimensions}>
    <div class="tab">
        <span class="title"> Visualization Type 1 </span>

        <button class="tablinks" on:click={selectTab}>Map</button>
        <button class="tablinks" on:click={selectTab}>Models</button>
    </div>


    <div id="vis-container">
        {#if selectedVis === "Map"}
            <Map2 {filteredData}>
            </Map2>
        {:else if selectedVis === "Models"}
            <Timevis>
            </Timevis>
        {:else}
            <span></span>
        {/if}
    </div>


    <Helper visualizationType="{selectedVis}" parentEl="{element}"></Helper>
</div>


<style>
    #main-div {
        flex: 1 1 0;
        position: relative;
    }

    #vis-container {
        height: 70vh;
        /*height: 80%;*/
    }
</style>

