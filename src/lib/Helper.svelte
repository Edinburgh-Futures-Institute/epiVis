<script lang="ts">

    export let visualizationType;
    export let parentEl: HTMLElement;
    let isHovered = false;
    let x: number;
	let y: number;

    function mouseOver(event) {
		isHovered = true;
		x = event.pageX + 5;
		y = event.pageY + 5;
	}
	function mouseMove(event) {
		x = event.pageX + 5 - parentEl.offsetLeft;
		y = event.pageY + 5 - parentEl.offsetTop;

		// x = event.clientX + 5 + window.scrollX;
		// y = event.clientY + 5 + window.scrollY;
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
            The map shows the regions of study of the scientific papers. The more colored a country is, the more papers have studied a strain in this country.
        {:else if visualizationType == "Models"}
            This visualization is a heatmap showing the frequency of usage of different model types according the years.
            {:else if visualizationType == "Full"}
            This visualization shows a network of all entities in the data: papers, people, institutions, strains, waves, and countries.
            {:else if visualizationType == "People"}
            This visualization shows a network of all authors of papers. One isolated clique can be interpreted as one paper. Each author of the same paper will be connected to each other.
        {/if}
    </div>
{/if}

<style>
    #helper {
        text-decoration: underline;
        position: absolute;
        /*position: relative;*/
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