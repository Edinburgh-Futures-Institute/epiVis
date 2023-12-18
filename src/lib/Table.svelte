<script lang="ts">
    import {MODEL, PURPOSE, SPREAD, STAGE, allCols} from "../dataLoader.ts";

    import DataTable from 'datatables.net-dt';
    import 'datatables.net-dt/css/jquery.dataTables.min.css';

    import {onMount} from "svelte";

    export let filteredData;

    // let datatable: DataTable;
    let datatable;
    let element;
    let columnNameTooltip: HTMLElement;

    // let handler, rows
    // $: handler = new DataHandler(filteredData, {rowsPerPage: 20})
    // $: rows = handler.getRows()

    const className = (i) => `p${i}`

    let heatMapColumns = allCols.map((col, i) => {
        return {title: `C${i}`, data: col, className: className(i)}
    })


    // onMount(() => {
    //     datatable = new DataTable('#myTable', {
    //         columns: [
    //             {title: 'Id', data: "Epic Code "},
    //             {title: 'Title', data: "Title "},
    //             {title: 'Year', data: "Publication Year "},
    //             {title: 'AI Strain', data: "AI strain", render: (data, type, row, meta) => {
    //                     // console.log(55555, data, row, type, meta)
    //                     // return data.replace(",", ", ");
    //                     if (typeof data !== 'string') {
    //                         return data.join(", ")
    //                     } else {
    //                         return data;
    //                     }
    //                 }},
    //             {title: 'Epidemic waves', data: "Epidemic waves"},
    //             // {title: 'Models', data: MODEL},
    //             {title: 'Models', data: "Models"},
    //             // {title: 'Purpose', data: PURPOSE},
    //             // {title: 'Spread', data: SPREAD},
    //             // {title: 'Stage', data: STAGE},
    //             // {title: 'Hosts', data: "Hosts "},
    //         ].concat(heatMapColumns),
    //         createdRow: function (row, data, dataIndex) {
    //             for (let i = 0; i < allCols.length; i++) {
    //                 let col = allCols[i];
    //                 let value = data[col];
    //                 // let cell = row.querySelector(`.${col}`);
    //                 let cell = row.querySelector(`.p${i}`);
    //
    //                 if (["P", "Y", "S"].includes(value)) {
    //                     cell.style.background = '#a1d99b'
    //                 } else if (["N", "I"].includes(value)) {
    //                     cell.style.background = '#fdbb84'
    //                 } else if (["M", "L"].includes(value)) {
    //                     cell.style.background = '#ffeda0'
    //                 }
    //             }
    // },
    //         data: filteredData
    //     });
    // })



    function redraw(filteredData) {
        if (!element) return;
        // console.log("draw", filteredData)

        if (datatable) {
            datatable.clear();
            datatable.rows.add(filteredData);
            datatable.draw();
        } else {
            datatable = new DataTable('#myTable', {
                columns: [
                    {title: 'Id', data: "Epic Code "},
                    {title: 'Title', data: "Title "},
                    {title: 'Year', data: "Publication Year "},
                    {title: 'AI Strain', data: "AI strain", render: (data, type, row, meta) => {
                            if (typeof data !== 'string') {
                                return data.join(", ")
                            } else {
                                return data;
                            }
                        }},
                    {title: 'Epidemic waves', data: "Epidemic waves"},
                    {title: 'Models', data: "Models", createdCell: createdCellCb},
                ].concat(heatMapColumns),
                createdRow: function (row, data, dataIndex) {
                    for (let i = 0; i < allCols.length; i++) {
                        let col = allCols[i];
                        let value = data[col];
                        // let cell = row.querySelector(`.${col}`);
                        let cell = row.querySelector(`.p${i}`);

                        if (["P", "Y", "S"].includes(value)) {
                            cell.style.background = '#a1d99b'
                        } else if (["N", "I"].includes(value)) {
                            cell.style.background = '#fdbb84'
                        } else if (["M", "L"].includes(value)) {
                            cell.style.background = '#ffeda0'
                        }
                    }
                },
                "initComplete": function(settings, json) {
                       // Create a div element
                    columnNameTooltip = document.createElement("div");
                    columnNameTooltip.style.display = "inline-block"
                    columnNameTooltip.style.float = 'right';
                    columnNameTooltip.style.marginRight = "20px";

                    columnNameTooltip.innerHTML = 'Column Title';


                    // Insert the div after the search input
                    let searchInput = document.querySelector('.dataTables_filter');
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
                data: filteredData
            });
        }
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

    $: redraw(filteredData);

</script>

<table bind:this={element} id="myTable">
</table>


<style>
    div {
        /*display: flex;*/
        /*flex-flow: column;*/
        width: 100vw;
    }

    thead {
        background: #fff;
    }

    tbody td {
        border: 1px solid #f5f5f5;
        padding: 4px 20px;
    }

    tbody tr {
        transition: all, 0.2s;
    }

    tbody tr:hover {
        background: #f5f5f5;
    }

    table {
        border-collapse: separate;
        border-spacing: 10;
    }
</style>