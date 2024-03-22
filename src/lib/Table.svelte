<script lang="ts">
    import * as d3 from "d3"

    import {
        MODEL,
        PURPOSE,
        SPREAD,
        STAGE,
        allCols,
        colColor,
        colToGroup,
        groupToColSorted,
        c16, c5, c6, c10, c12, c13, c15, c17, c20, c21, c22, c23, c24, c25, c26, c29
    } from "../dataLoader.ts";

    import DataTable from 'datatables.net-dt';
    import 'datatables.net-rowgroup'; // Import RowGroup plugin
    import 'datatables.net-dt/css/jquery.dataTables.min.css';

    import {onMount} from "svelte";
    import {Legend} from "../legend.ts";
    import {abbNean} from "../dataLoader.js";

    export let filteredData;

    let datatable;
    let element;
    let columnNameTooltip: HTMLElement;
    $: hideColumns = false;
    let rerender = false;

    const LIGHTGREEN = "rgb(197,220,180)"
    const GREEN = '#97d391'
    const LIGHTRED = '#f4a582'
    const RED = 'rgba(202,0,32,0.6)'
    const LIGHTBLUE = "#92c5de"
    const BLUE = 'rgba(5,113,176,0.6)'
    const YELLOW = '#ffeda0';


    // const cellColorScale = d3.scaleOrdinal()
    //     .domain([1, 2, 3, 4])
    //     .range([LIGHTGREEN, GREEN, LIGHTRED, RED])

    const cellColorScale4 = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range([BLUE, LIGHTBLUE, LIGHTRED, RED])

    const cellColorScale5 = d3.scaleOrdinal()
        .domain([1, 2, 3, 4, 5])
        .range([BLUE, LIGHTBLUE, YELLOW, LIGHTRED, RED])


    function multiValueColorScale(value) {
        let array = value.split(",");

        if (array.length == 1 && array[0] == "1") {
            return RED
        } else if (array.length == 1 && array[0] == '2') {
            return LIGHTRED
        } else if (array.length == 2) {
            return LIGHTBLUE
        } else if (array.length == 3) {
            return BLUE
        }
    }


    const className = (i) => `p${i}`


    // Columns with special character in their name need this render fct to work
    let heatMapColumns = allCols.map((col, i) => {
        let colDef = {title: `${i}`, data: col, className: className(i), width: "10%", render: ( data, type, full, meta ) => {
            return full[col]
        }}

        if (col == c26) {
            colDef.className = 'small-text';
        }

        return colDef
    })

    function redraw(filteredData, hideColumns: boolean) {
        if (!element) return;

        if (datatable && !rerender) {
            datatable.clear();
            datatable.rows.add(filteredData);
            datatable.draw();
        } else {
            if (datatable) {
                datatable.destroy();
                element.innerHTML = "";
            }

            let columns = hideColumns ? [] : [
                // {title: 'Id', data: "Epic Code "},
                    // {title: 'Title', data: "Title ", className: "titleCol"},
                    // {title: 'AI Strain', data: "AI strain", render: (data, type, row, meta) => {
                    //         if (typeof data !== 'string') {
                    //             return data.join(", ")
                    //         } else {
                    //             return data;
                    //         }
                    //     }},
                    // {title: 'Epidemic waves', data: "Epidemic waves"},
                    {title: 'Year', data: "Publication Year "},
                    // {title: 'Models', data: "Models", createdCell: createdCellCb}
            ];

            datatable = new DataTable('#myTable', {
                columns: columns.concat(heatMapColumns),
                orderCellsTop: true,
                // fixedHeader: true,
                createdRow: function (row, data, dataIndex) {
                    for (let i = 0; i < allCols.length; i++) {
                        let col = allCols[i];
                        let value = data[col];
                        // let cell = row.querySelector(`.${col}`);
                        let cell = row.querySelector(`.p${i}`);
                        if (!cell) continue;

                        let colorScale;

                        if (col == c16) {
                            cell.style.background = multiValueColorScale(value);
                        } else if (col == c5) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([RED, LIGHTRED, LIGHTBLUE, "gray"])
                        } else if (col == c6) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([RED, LIGHTBLUE, LIGHTRED, YELLOW])
                        } else if (col == c10) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([RED, LIGHTRED, LIGHTBLUE, YELLOW])
                        } else if (col == c12) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([BLUE, LIGHTBLUE, LIGHTRED, RED])
                        } else if (col == c13) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3])
                            .range([LIGHTBLUE, LIGHTRED, BLUE])
                        } else if (col == c15) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([BLUE, LIGHTBLUE, LIGHTRED, YELLOW])
                        } else if (col == c17) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3])
                            .range([LIGHTBLUE, LIGHTBLUE, "gray"])
                        } else if (col == c20) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([LIGHTBLUE, BLUE, LIGHTRED, RED])
                        } else if (col == c21) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([LIGHTBLUE, LIGHTRED, YELLOW])
                        } else if (col == c22) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3, 4])
                            .range([LIGHTBLUE, LIGHTRED, "gray"])
                        } else if (col == c23) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, "1,2"])
                            .range([LIGHTBLUE, LIGHTBLUE])
                        } else if (col == c24) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2, 3])
                            .range([LIGHTBLUE, LIGHTRED, YELLOW])
                        }  else if (col == c25) {
                            colorScale = d3.scaleOrdinal()
                            .domain([1, 2])
                            .range([LIGHTBLUE, LIGHTRED])
                        }  else if (col == c29) {
                            colorScale = d3.scaleLinear()
                            .domain([1, 15])
                            .range([LIGHTBLUE, RED])
                        }  else {
                            if (["P", "Y", "S"].includes(value)) {
                                // cell.style.background = GREEN
                                cell.style.background = LIGHTBLUE
                            } else if (["N", "I"].includes(value)) {
                                cell.style.background = LIGHTRED
                            } else if (["M", "L"].includes(value)) {
                                cell.style.background = YELLOW
                            } else if (["1", "2", "3", "4", "0"].includes(value)) {
                                cell.style.background = cellColorScale4(Number(value))
                            } else if (value == "N/A") {
                                cell.style.background = "gray"
                            }
                        }

                        if (colorScale) {
                            if (value.includes(",")) {
                                cell.style.background = colorScale(value)
                            } else {
                                cell.style.background = colorScale(Number(value))
                            }
                        }

                    }
                },
                initComplete: function(settings, json) {
                    // Button for redrawing
                    // let button = document.createElement("button");
                    // button.style.display = "inline-block"
                    // button.innerHTML = 'Hide';
                    // button.style.marginLeft = "20px";
                    //
                    // button.onclick = () => {
                    //     rerender = true;
                    //     hideColumns = !hideColumns;
                    //
                    //     // Weird but I have to call the function
                    //     redraw(filteredData, hideColumns)
                    //     rerender = false;
                    // }


                    // Insert the div after the search input
                    let searchInput = document.querySelector('.dataTables_filter');
                    // searchInput.parentNode.insertBefore(button, searchInput.nextSibling);

                    // Legend of cells
                    let legend = document.createElement("div");
                    legend.className = "table-legend";
                    legend.style.display = "inline-block"
                    legend.innerHTML = '';
                    legend.style.marginLeft = "20px";
                    searchInput.parentNode.insertBefore(legend, searchInput.nextSibling);

                    let leg = Legend(cellColorScale5, {
                        title: "",
                        tickSize: 0
                    }, ["Very good", "Good", "Neutal", "Bad", "Very bad"])
                    legend.appendChild(leg)


                    // Title of column element
                    columnNameTooltip = document.createElement("div");
                    columnNameTooltip.style.display = "inline-block"
                    columnNameTooltip.style.float = 'right';
                    columnNameTooltip.style.marginRight = "15px";
                    columnNameTooltip.style.width = "50%";
                    columnNameTooltip.innerHTML = 'Column Title';

                    // Insert the div after the search input
                    // let searchInput = document.querySelector('.dataTables_filter');
                    searchInput.parentNode.insertBefore(columnNameTooltip, searchInput.nextSibling);

                    // Add the complex header layout to the table
                    let headerRow = document.createElement("tr")
                    function createHeaderCol(title, colspan) {
                        let row = document.createElement("th");
                        row.setAttribute("colspan", colspan);
                        // row.innerHTML = title

                        title = abbNean[title] ?? "";
                        row.innerHTML = title
                        return row;
                    }
                    headerRow.append(createHeaderCol("", columns.length))
                    for (let [group, cols] of Object.entries(groupToColSorted)) {
                        headerRow.append(
                            createHeaderCol(group, cols.length)
                        );
                    }

                    let header = this.api().table().header();
                    header.prepend(headerRow);
                },
                "headerCallback": function(thead, data, start, end, display) {
                    var ths = thead.querySelectorAll('th');

                    // Attach mouseover event to each header cell
                    ths.forEach(th => {
                        let columnName: string = allCols[th.cellIndex - columns.length]
                        if (!columnName) {
                            columnName = th.textContent;
                        }

                        // Color headers
                        // th.style.backgroundColor = colColor(colToGroup[columnName]);

                        th.addEventListener("mouseover", function() {
                            if (Object.keys(groupToColSorted).includes(th.textContent)) {
                                columnNameTooltip.innerHTML = th.textContent;
                            } else {
                                columnNameTooltip.innerHTML = columnName;
                            }
                        });
                    })
                },
                data: filteredData,
                rowGroup: {
                    dataSrc: 'Title ', // Group by the 'name' column,
                    startRender: function(rows, group) {
                        // Customize the title shown in the group row
                        let index = rows[0][0]
                        let datum = filteredData[index];
                        let title = `${datum["Epic Code "]}: ${group} (${datum["Publication Year "]}) (${datum["Epidemic waves"]})`
                        return title
                    }
                }
            });
        }

        datatable.order(
            [[0, 'desc']]
        ).draw()
    }

    const createdCellCb = (td, cellData, rowData, row, col) => {
        // Add a hover effect to the cells in the specified column
        td.addEventListener('mouseover', function () {
            td.style.backgroundColor = 'lightgray';
        });

        td.addEventListener('mouseout', function () {
            td.style.backgroundColor = ''; // Reset background color on mouseout
        });
    };

    $: redraw(filteredData, hideColumns);

</script>

<div id="mainTableDiv" class="main-component">
    <div id="title-div">
        <span class="title">Papers Found</span> The table lists all papers corresponding to the above specified filter criteria. Selecting an entity in one or more of the visualizations, will add/remove additional filter criteria.
    </div>
    <div id="table-div" class="vis-frame">
        <table bind:this={element} id="myTable">
        </table>
    </div>
</div>


<style>
    #table-div {
        background-color: white;
    }

    #title-div {
        padding-left: 40px;
        padding-bottom: 20px;
    }

    .title {
        /*padding-left: 40px;*/
        padding-right: 20px;
    }

    thead {
        background: #fff;
    }


    tbody tr {
        transition: all, 0.2s;
    }

    tbody tr:hover {
        background: #f5f5f5;
    }

    #table-div {
    /*    width: 50%;*/
    /*    width: 90%;*/
        padding-left: 1em;
        padding-top: 1em;
    }

    #myTable {
        /*border-collapse: separate;*/
        border-collapse: collapse;
        border-spacing: 10;
    }

    /*    Datatable css is an app.css */
</style>