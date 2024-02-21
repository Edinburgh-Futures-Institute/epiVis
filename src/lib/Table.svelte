<script lang="ts">
    import * as d3 from "d3"

    import {MODEL, PURPOSE, SPREAD, STAGE, allCols} from "../dataLoader.ts";

    import DataTable from 'datatables.net-dt';
    import 'datatables.net-rowgroup'; // Import RowGroup plugin
    import 'datatables.net-dt/css/jquery.dataTables.min.css';

    import {onMount} from "svelte";

    export let filteredData;

    // let datatable: DataTable;
    let datatable;
    let element;
    let columnNameTooltip: HTMLElement;
    $: hideColumns = false;
    let rerender = false;

    // const cellColorScale = d3.scaleLinear()
    //     .domain([1, 4])
    //     .range(["rgb(193,222,172)",'rgb(133,30,30)'])

    const cellColorScale = d3.scaleOrdinal()
        .domain([1, 2, 3, 4])
        .range(["rgb(193,222,172)",'rgb(103,206,74)', 'rgb(217,128,128)', 'rgb(141,36,36)'])


    const className = (i) => `p${i}`


    // Columns with special character in their name need this render fct to work
    let heatMapColumns = allCols.map((col, i) => {
        return {title: `${i}`, data: col, className: className(i), width: "10%", render: ( data, type, full, meta ) => {
            return full[col]
        }}
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
                    {title: 'Year', data: "Publication Year "},
                    // {title: 'AI Strain', data: "AI strain", render: (data, type, row, meta) => {
                    //         if (typeof data !== 'string') {
                    //             return data.join(", ")
                    //         } else {
                    //             return data;
                    //         }
                    //     }},
                    // {title: 'Epidemic waves', data: "Epidemic waves"},
                    {title: 'Models', data: "Models", createdCell: createdCellCb},
            ];

            datatable = new DataTable('#myTable', {
                columns: columns.concat(heatMapColumns),
                createdRow: function (row, data, dataIndex) {
                    for (let i = 0; i < allCols.length; i++) {
                        let col = allCols[i];
                        let value = data[col];
                        // let cell = row.querySelector(`.${col}`);
                        let cell = row.querySelector(`.p${i}`);
                        if (!cell) continue;

                        if (["P", "Y", "S"].includes(value)) {
                            cell.style.background = '#a1d99b'
                        } else if (["N", "I"].includes(value)) {
                            cell.style.background = '#fdbb84'
                        } else if (["M", "L"].includes(value)) {
                            cell.style.background = '#ffeda0'
                        } else if (["1", "2", "3", "4", "0"].includes(value)) {
                            cell.style.background = cellColorScale(value)
                        } else if (value == "N/A") {
                            cell.style.background = "gray"
                        }
                    }
                },
                "initComplete": function(settings, json) {

                    // Button for redrawing
                    let button = document.createElement("button");
                    button.style.display = "inline-block"
                    button.innerHTML = 'Hide';
                    button.style.marginLeft = "20px";

                    button.onclick = () => {
                        rerender = true;
                        hideColumns = !hideColumns;

                        // Weird but I have to call the function
                        redraw(filteredData, hideColumns)
                        // hideColumns = true;

                        rerender = false;
                    }

                    // Insert the div after the search input
                    let searchInput = document.querySelector('.dataTables_filter');
                    searchInput.parentNode.insertBefore(button, searchInput.nextSibling);

                    // Title of column element
                    columnNameTooltip = document.createElement("div");
                    columnNameTooltip.style.display = "inline-block"
                    columnNameTooltip.style.float = 'right';
                    columnNameTooltip.style.marginRight = "20px";
                    columnNameTooltip.innerHTML = 'Column Title';

                    // Insert the div after the search input
                    // let searchInput = document.querySelector('.dataTables_filter');
                    searchInput.parentNode.insertBefore(columnNameTooltip, searchInput.nextSibling);
                },
                "headerCallback": function(thead, data, start, end, display) {
                    var ths = thead.querySelectorAll('th');

                    // Attach mouseover event to each header cell
                    ths.forEach(th => {
                        let columnName: string = allCols[th.cellIndex - 6]
                        if (!columnName) {
                            columnName = th.textContent;
                        }

                        th.addEventListener("mouseover", function() {
                            columnNameTooltip.innerHTML = columnName;
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
                        // return group
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

<div id="mainTableDiv" class="main-componenttt">
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

/*    table {border-collapse: collapse}*/
/*table td {padding: 0}*/

    /*    Datatable css is an app.css */
</style>