<script lang="ts">
    import * as d3 from "d3";

    import {onMount} from "svelte";
    import {affiliationsFilename, authorsFilename, data, papersFilename} from "../dataLoader.ts";


    let width: number = 600;
    let height: number = 600;
    const margin = 30;
    const widthEff: number = width - 2 * margin;
    const heightEff: number = height - 2 * margin;

    const c1 = "Assumptions mentioned (Yes/No)"
    const c2 = "Assumptions included in Mode/review  Design (Yes/No)"
    const c3 = "Impacts mentioned (YES/NO)"
    const c4 = "Impacts included in the model/review design (YES/No)"
    const c5 = "Nature of impacts (Positive/Negative/Mixed)"
    const c6 = "Biases mentioned (Yes/No/Insufficiently mentioned)"
    const c7 = "Impacts of biases explained (Yes/No/Insufficiently explained)"
    const c8 = "Uncertainty explained (YES/NO/Insufficiently explained)"
    const c9 = "Impacts of uncertainty explained (YES/NO/Insufficiently explained)"
    const c10 = "Overall reporting (Sufficient/Insufficient)"
    const allCols = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];

    let element: HTMLElement;
    let svg: SVGElement;
    let g: SVGElement;
    let svgLegend: SVGElement;

    onMount(() => {
        render(width, height)
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        width = rect.width - legendWidth - 200;
        height = rect.height;
    }

    function render(width, height) {
        if (!svg) return;

        // Build X scales and axis:
        var x = d3.scaleBand()
            .range([margin, widthEff])
            .domain(allCols)
            .padding(0.01);

// Build X scales and axis:
        var y = d3.scaleBand()
            .range([heightEff, margin])
            .domain(data.map(d => d["Epic Code "]))
            .padding(0.01);

        d3.select(g).append("g").classed("axis", true)
            .attr("transform", "translate(0," + heightEff + ")")
            .call(d3.axisBottom(x))

         d3.select(g).append("g")
        .call(d3.axisLeft(y));


        d3.select(g)
            .selectAll(".row")
          .data(data, d => d)
          .join("g")
          .classed("row", true)
             .selectAll("rect")
             .data(d => allCols.map(col => [d["Epic Code "], d[col], col]))
             .join("rect")
          .attr("x", function(d) {
              return x(d[2]) })
          .attr("y", function(d) { return y(d[0]) })
          .attr("width", x.bandwidth() )
          .attr("height", y.bandwidth() )
          .style("fill", function(d) {
              if (d[1] == "Y" || d[1] == "P" || d[1] == "S") {
                  return "#a6d96a"
              } else if (d[1] == "N" || d[1] == "I") {
                  return "#f46d43"
              } else if (d[1] == "M" || d[1] == "L") {
                  return "#fee08b"
              }
          } )

        // d3.select(svg)
        //  selectAll("rect")
        //   .data(data, function(d) {return d.group+':'+d.variable;})
        //   .enter()
        //   .append("rect")
        //   .attr("x", function(d) { return x(d.group) })
        //   .attr("y", function(d) { return y(d.variable) })
        //   .attr("width", x.bandwidth() )
        //   .attr("height", y.bandwidth() )
        //   .style("fill", function(d) { return myColor(d.value)} )
    }


    // $: render(width, height)
</script>

<div id="heatmap-div" bind:this={element} on:resize={updateDimensions}>
    <svg bind:this={svg} width={width} height={width}>
        <g bind:this={g} transform="translate({margin}, {margin})"></g>
    </svg>
</div>


<style>

    svg {
        margin: 0 auto;
    }
</style>

