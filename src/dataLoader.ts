import * as d3 from "d3"

export let data = await d3.csv(`./src/assets/20_Sept.csv`, d => {
    // console.log(d)
    return d
})