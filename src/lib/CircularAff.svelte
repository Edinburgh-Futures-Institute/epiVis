
<script lang="ts">
    import * as d3 from "d3";

    import {onMount} from "svelte";
    import {affiliationsFilename, paperAffiliationTable} from "../dataLoader.ts";

    let specPath = "./netpanorama-vis/templates/affiliationProjOneTable.json"

    let width: number = 10;
    let height: number = 10;

    let affiliations: [];
    let links: [];

    let element: HTMLElement;
    let svg: HTMLElement;
    let svgLegend: SVGElement;
    let nodeToNeighbors = {};

    onMount(() => {
        updateDimensions();
        getNetpanNet().then(() => {
            render(width, height);
        })
    })

    function updateDimensions() {
        const rect = element.getBoundingClientRect();
        // width = rect.width - legendWidth - 200;
        width = rect.width;
        height = rect.height;
    }

    async function getNetpanNet() {
        if (width && element) {
            let viewer = await NetPanoramaTemplateViewer.render(specPath, {
                affiliations: affiliationsFilename,
                affiliationPaperLinks: paperAffiliationTable,
                width: 0,
                height: 0
            }, "affiliationNet");

            // affiliations = viewer.state.network.nodes
            // links = viewer.state.network.links

            // affiliations = viewer.state.networkAff.nodes
            affiliations = viewer.state.network.nodes
            links = viewer.state.network.links

            affiliations = affiliations.filter(aff => aff.data);
            // Fill neighbor map
            affiliations.forEach(node => {
                nodeToNeighbors[node.id] = [];
            })

            for (let link of links) {
                let sourceId = link.source.id;
                let targetId = link.target.id;

                if (!nodeToNeighbors[sourceId] || !nodeToNeighbors[targetId]) {
                    continue;
                }

                nodeToNeighbors[sourceId].push(link.target);
                nodeToNeighbors[targetId].push(link.source);
            }
        }
    }

    function render(width, height) {
        if (!svg) return;

        affiliations.sort((a, b) => {
            let countryCompare = a.data["Country "].localeCompare(b.data["Country "])
            if (countryCompare == 0) {
                return a.data["Discipline"].localeCompare(b.data["Discipline"])
            }
            return countryCompare
        })

        let currentCountry = affiliations[0].data["Country "]
        let pos = 1
        let countryToCount = {};
        let countryToAff = d3.group(affiliations, d => d.data["Country "])
        let countryToLinkCount = {};

        for (let [country, affilitations] of countryToAff.entries()) {
            let totalLink = 0;
            let intraLink = 0
            affilitations.forEach(aff => {
                totalLink += aff.degree ?? 0
                let sameCountryNb = nodeToNeighbors[aff.id].filter(d => d.data["Country "] == country).length;
                intraLink += sameCountryNb
            })
            // total number of link per country
            countryToLinkCount[country] = totalLink - intraLink / 2;
        }

        for (let inst of affiliations) {
            let country = inst.data["Country "]

            if (countryToCount[country]) {
                countryToCount[country] += 1
            } else {
                countryToCount[country] = 1
            }

            if (currentCountry != country) {
                pos += 1;
                currentCountry = country;
            }
            inst.pos = pos;

            pos += 1;
        }

        const radialScale = d3.scaleLinear([0, pos], [0, Math.PI * 2])

        // const countryColorScale = d3.scaleOrdinal(d3.schemeAccent)
        const countryColorScale = d3.scaleOrdinal(d3.schemeSet1)

        // const radiusScale = d3.scaleLinear(d3.extent(institutions.map(d => d.degree)), [4, 10]);
        const radiusScale = d3.scaleLinear(d3.extent(affiliations.map(d => d.degree)), [4, 10]);

        const distance = height / 2.5;
        const x = (d) => distance * Math.cos(radialScale(d.pos))
        const y = (d) => {
            return distance * Math.sin(radialScale(d.pos))
        }

        //  Lines
        // const linksMark = d3.select(svg)
        //     .selectAll(".link")
        //     .data(links)
        //     .join("line")
        //     // .attr("d", d => line(d))
        //     .attr("x1", d => x(d.source))
        //     .attr("y1", d => y(d.source))
        //     .attr("x2", d => x(d.target))
        //     .attr("y2", d => y(d.target))
        //     .attr("stroke", "black")
        //     .classed("link", true)

        // const linksG = d3.group(links, d => {
        //     let ids = [d.source.id, d.target.id];
        //     ids.sort();
        //     return ids.join("-")
        // })

        const linksMark = d3.select(svg)
            .selectAll(".link")
            .data(links)
            .join("path")
            .attr("d", d => {
                let x1 = x(d.source);
                let x2 = x(d.target);
                let y1 = y(d.source);
                let y2 = y(d.target);

                const distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

                let xMid = (x2 + x1)/2
                let yMid = (y2 + y1)/2

                let width = (0 - xMid)
                let height = (0 - yMid)

                let xI = 0 - width + width * distance / 300;
                let yI = 0 - height + height * distance / 300;

                return `M ${x1} ${y1} Q ${xI} ${yI} ${x2} ${y2}`
            })
            .attr("stroke", d => {
                if (d.source.data["Intitute "] == d.target.data["Intitute "]) {
                    return "red"
                }
                return "rgb(77,77,77)"
            })
            .attr("stroke-width", d => {
                if (d.source.data["Intitute "] == d.target.data["Intitute "]) {
                    return 2
                }
                return 1
            })
            .attr("fill", "none")
            .classed("link", true)

        let nodesMark = d3.select(svg)
            .selectAll(".node")
            .data(affiliations)
            .join("circle")
            .attr("cx", d => x(d))
            .attr("cy", d => y(d))
            .attr("r", d => radiusScale(d.degree))
            .attr("fill", d => countryColorScale(d.data["Discipline"]))
            .attr("stroke", "black")
            .classed("node", true)
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)

        function mouseOver(e, d) {
            d3.selectAll(".node")
                .style("opacity", d2 => {
                    if (!nodeToNeighbors[d.id].includes(d2.id)) {
                        return 0.3;
                    }
                })
                .attr("stroke-width", d2 => {
                    if (nodeToNeighbors[d.id].includes(d2.id)) {
                        return 3;
                    } else if (d2 == d) {
                        return 6;
                    }
                })

            d3.select(this)
                .style("opacity", 1)

            d3.selectAll(".nodeText")
                .attr("display", dtext => {
                    if (d.id == dtext.id || nodeToNeighbors[d.id].includes(dtext.id)) {
                        return ""
                    }
                    return "none"
                }).attr("font-weight", d2 => {
                    if (nodeToNeighbors[d.id].includes(d2.id)) {
                        return "normal";
                    } else if (d2 == d) {
                        return "bold ";
                    }
                }).attr("font-size", d2 => {
                    if (nodeToNeighbors[d.id].includes(d2.id)) {
                        return "small";
                    } else if (d2 == d) {
                        return "medium ";
                    }
                })

            // TODO: make it faste by precomputing neighbors
            d3.selectAll(".link")
                .style("opacity", link => {
                    if (link.source.id != d.id && link.target.id != d.id) {
                        return 0.07;
                    }
                    return 1;
                })

            d3.selectAll(".country")
                .style("opacity", d2 => {
                    if (d.data["Country "] == d2.data[0]) {
                        return 1
                    }
                    return 0.5
                })
        }

        function mouseLeave(e, d) {
            d3.selectAll(".node")
                .style("opacity", 1)
                .attr("stroke-width", 1)

            d3.selectAll(".link")
                .style("opacity", link => {
                    return 1
                })
        }

        const pie = d3.pie().padAngle(0.05).sort(null).sortValues(null).startAngle(Math.PI / 2).endAngle(3 * Math.PI).value(d => d[1]);
        const arc = d3.arc().innerRadius(distance + 30).outerRadius(distance + 30 + 20);

        const countries = d3.select(svg)
            .append("g")
            .attr("fill", "#ccc")
            .attr("stroke", "#000")
            .attr("stroke-width", "1px")
            .attr("stroke-linejoin", "round")
            .selectAll(".country")
            .data(pie(Object.entries(countryToCount)))
            .join("path")
            .attr("d", arc.cornerRadius(6))
            .classed("country", true)
            .on("mouseover", mouseOverCountry)
            .on("mouseleave", mouseLeaveCountry)

        // Nb of links per country
        d3.select(svg)
            .selectAll("textCountry")
            .data(pie(Object.entries(countryToCount)))
            .join("text")
            .attr("transform", (d, i) => {
                return `translate(${arc.centroid(d)})`
            })
            .attr("x", (d, i) => {
                return -10;
            })
            .attr("y", d => {
                return 0
            })
            .text((d, i) => {
                let country = Object.keys(countryToCount)[i];
                // return `(${countryToLinkCount[country]}) ` + country
                return country
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .classed("textCountry", true)
            .on("mouseover", mouseOverCountry)
            .on("mouseleave", mouseLeaveCountry)

        d3.select(svg)
            .selectAll("textCountryNb")
            .data(pie(Object.entries(countryToCount)))
            .join("text")
            .attr("transform", (d, i) => {
                return `translate(${arc.centroid(d)})`
            })
            .attr("x", (d, i) => {
                return 0;
            })
            .attr("y", d => {
                return 15
            })
            .text((d, i) => {
                let country = Object.keys(countryToCount)[i];
                return `(${countryToLinkCount[country]})`
            })
            .attr("text-anchor", "middle")
            .attr("font-size", "13px")
            .classed("textCountryNb", true)
            .on("mouseover", mouseOverCountry)
            .on("mouseleave", mouseLeaveCountry)


        function mouseOverCountry(e, d) {
            d3.selectAll(".node")
                .style("opacity", .5)
            // d3.selectAll(".country")
            //     .style("opacity", .5)

            d3.selectAll(".country")
                .style("opacity", d2 => {
                    if (d.index == d2.index) {
                        return 1
                    }
                    return 0.5
                })

            d3.selectAll(".textCountry")
                .style("opacity", dtext => {
                    if (d.index == dtext.index) {
                        return 1
                    }
                    return 0.5
                })

            d3.selectAll(".nodeText")
                .attr("display", dtext => {
                    if (d.id == dtext.id) {
                        return ""
                    }
                    return "none"
                })

            // TODO: make it faste by precomputing neighbors
            d3.selectAll(".link")
                .style("opacity", link => {
                    if (link.source.id != d.id && link.target.id != d.id) {
                        return 0.2;
                    }
                    return 1;
                })
        }

        function mouseLeaveCountry(e, d) {
            d3.selectAll(".node")
                .style("opacity", 1)

            d3.selectAll(".link")
                .style("opacity", link => {
                    return 1
                })
        }

        // Affiliations labels
        d3.select(svg)
            .selectAll(".nodeText")
            .data(affiliations)
            .join("text")
            .attr("x", d => x(d) + 8)
            .attr("y", d => y(d) - 10)
            .text(d => `(${d.degree}) ` + d.data["Afilliation name -"])
            .classed("nodeText", true)
            .attr("display", "none")
            .attr("text-anchor", d => {
                let rad = radialScale(d.pos);
                if (rad < Math.PI / 2 || rad > 3 * Math.PI / 2) {
                    return "end";
                } else {
                    return "start"
                }
            })
            .on("mouseover", mouseOver)
            .on("mouseleave", mouseLeave)


        renderLegend();
        function renderLegend() {
            d3.select("#svg-legend").html("")

            let xStart = 10;
            // let xStart = 100;

            // Add one dot in the legend for each name.
            d3.select("#svg-legend")
                .selectAll("mydots")
                .data(countryColorScale.domain())
                .join("circle")
                .attr("cx", xStart)
                .attr("cy", function (d, i) {
                    return xStart + i * 25
                }) // 100 is where the first dot appears. 25 is the distance between dots
                .attr("r", 7)
                .style("fill", function (d) {
                    return countryColorScale(d)
                })

            // Add one dot in the legend for each name.
            // d3.select(svgLegend)
            d3.select("#svg-legend")
                .selectAll("mylabels")
                .data(countryColorScale.domain())
                .join("text")
                .attr("x", xStart + 20)
                .attr("y", function (d, i) {
                    return xStart + i * 25
                })
                .style("fill", function (d) {
                    return countryColorScale(d)
                })
                .text(function (d) {
                    return d
                })
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
        }
    }

    // $: render(width, height)
</script>

<div id="circular-div" bind:this={element} on:resize={updateDimensions}>
    <svg bind:this={svg} width={width} height={height} viewBox="{-width / 2}, {-height / 2}, {width}, {height}">
    </svg>
</div>
<div id="affiliationNet">
</div>


<style>
    #circular-div {
        /*justify-content: center;*/
        /*align-items: center;*/
        /*width: 100%;*/
        height: 100%;
    }

    /*svg {*/
    /*    display: inline-block;*/
    /*    vertical-align: top;*/
    /*}*/
</style>

