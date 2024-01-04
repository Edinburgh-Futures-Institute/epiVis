<script lang="ts">

    export let visualizationType;
    let isHovered = false;
    let x: number;
	let y: number;


    function mouseOver(event) {
		isHovered = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseMove(event) {
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseLeave() {
		isHovered = false;
	}

</script>

<div on:mouseover={mouseOver}
  on:mouseleave={mouseLeave}
	on:mousemove={mouseMove} id="helper">How to read this visualization?</div>

{#if isHovered}
	<div style="top: {y}px; left: {x}px;" class="tooltip">
        {#if visualizationType == "Map"}
            MAP
        {:else if visualizationType == "Models"}
            Models are ...
        {/if}
    </div>
{/if}

<style>
    #helper {
        text-decoration: underline;
        position: absolute;
        bottom: 1em;
    }

    .tooltip {
		border: 1px solid #ddd;
		box-shadow: 1px 1px 1px #ddd;
		background: white;
		border-radius: 4px;
		padding: 4px;
		position: absolute;
	}
</style>