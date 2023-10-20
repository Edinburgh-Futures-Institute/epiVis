<script lang="ts">
    import * as Plot from "@observablehq/plot";
    import * as d3 from "d3"

    import {data, MODEL, PUBYEAR} from "../dataLoader.ts";
    import {onMount} from "svelte";


    let width = 1000;
    let height = 1200;
    let overlap = 1;


    onMount(() => {

        // console.log(44, d3.groups(data, d => [d[MODEL], d[PUBYEAR]])
        // console.log(44, d3.groups(data, d => [d[MODEL], d[PUBYEAR]]))

        let dataFiltered = data.filter(d => d[MODEL] && d[PUBYEAR])

        let group = d3.flatGroup(
            dataFiltered,
            ...[MODEL, PUBYEAR].map(k => d => d[k]) // instead of d => d.Sex and d => d.Eye etc
        )

        group = group.map(d => {
            d.push({v: d[2].length})
            // return {value: d[2].length, year: Number(d[1]), model: d[0]}
            return {value: d[2].length, year: d[1], model: d[0]}
        })

        console.log(111, group)

        // let modelGroup = d3.groups(group, d => d[0]);
        let modelGroup = d3.groups(group, d => d.model);
        console.log(modelGroup)

        let ridgePlot = Plot.plot({
            height: 40 + new Set(dataFiltered.map(d => d[MODEL])).size * 50,
            width,
            marginBottom: 1,
            marginLeft: 120,
            x: {axis: "top"},
            y: {axis: null, range: [2.5 * 17 - 2, (2.5 - overlap) * 17 - 2]},
            fy: {label: null, domain: dataFiltered.map(d => d[MODEL])}, // preserve input order
            marks: [
                modelGroup.map(([, values]) => [
                    Plot.areaY(values, {
                        x: "year",
                        y: "value",
                        fy: "model",
                        curve: "basis",
                        sort: "year",
                        fill: "rgba(128,197,227,0.6)"
                    }),
                    Plot.lineY(values, {
                        x: "year",
                        y: "value",
                        fy: "model",
                        curve: "basis",
                        sort: "year",
                        strokeWidth: 1
                    })
                ])
            ]
        })
        document.querySelector("#ridgeplot").append(ridgePlot)

        let heatmap = Plot.plot({
            // marginBottom: 80,
            width: 1200,
            height: 800,
            x: {label: null},
            y: {label: null},
            color: {label: "Count", legend: true, scheme: "YlGnBu"},
            marks: [
                Plot.cell(data, Plot.group({fill: "count"}, {x: PUBYEAR, y: MODEL}))
            ]
        })

        document.querySelector("#heatmap").append(heatmap)
    })

</script>

<div id="ridgeplot">
</div>

<div id="heatmap">
</div>