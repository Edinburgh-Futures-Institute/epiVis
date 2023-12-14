<script lang="ts">
    import {DataHandler} from '@vincjo/datatables'
    import {MODEL, PURPOSE, SPREAD, STAGE, allCols} from "../dataLoader.ts";

    import DataTable from 'datatables.net-dt';
    import 'datatables.net-dt/css/jquery.dataTables.min.css';

    import {onMount} from "svelte";

    export let filteredData;

    // let handler, rows
    // $: handler = new DataHandler(filteredData, {rowsPerPage: 20})
    // $: rows = handler.getRows()

    // console.log(filteredData)

    let heatMapColumns = allCols.map((col, i) => {
        return {title: `C${i}`, data: col, className: col}
    })

    onMount(() => {
        console.log(444, heatMapColumns);
        let table = new DataTable('#myTable', {
            columns: [
                {title: 'Id', data: "Epic Code "},
                {title: 'Title', data: "Title "},
                {title: 'Year', data: "Publication Year "},
                {title: 'AI Strain', data: "AI strain"},
                {title: 'Epidemic waves', data: "Epidemic waves"},
                // {title: 'Models', data: MODEL},
                {title: 'Models', data: "Models"},
                // {title: 'Purpose', data: PURPOSE},
                // {title: 'Spread', data: SPREAD},
                // {title: 'Stage', data: STAGE},
                // {title: 'Hosts', data: "Hosts "},
                // {title: 'test', data: allCols[5], className:"test"},
            ].concat(heatMapColumns),
    //         'rowCallback': function(row, data, index){
    // if(data[3]> 11.7){
    //     $(row).find('td:eq(3)').css('color', 'red');
    // }
    // if(data[2].toUpperCase() == 'EE'){
    //     $(row).find('td:eq(2)').css('color', 'blue');
    // }},
            createdRow: function (row, data, dataIndex) {
                for (let col of allCols.slice(4)) {
                    let value = data[col];
                    let cell = row.querySelector(`.${col}`);

                    // switch(value) {
                    //     case "N":
                    //         cell.style.background = 'red'
                    //         break;
                    //     case "Y":
                    //         cell.style.background = 'green'
                    //         break;
                    // }
                }


      var ageColumn = row.querySelector('.test');




      // You can add more conditions for other columns
    },
            data: filteredData
        });

    })
</script>


<table id="myTable">
</table>

<!--<div>-->
<!--    <table>-->
<!--        <thead>-->
<!--        <tr>-->
<!--            <th>Title</th>-->
<!--            <th>Year</th>-->
<!--            <th>First Author</th>-->
<!--            &lt;!&ndash;            <th>Second Author</th>&ndash;&gt;-->
<!--            &lt;!&ndash;            <th>Third Author</th>&ndash;&gt;-->
<!--            <th>AI strain</th>-->
<!--            <th>Epidemic wave</th>-->
<!--            <th>Model type</th>-->
<!--            <th>Purpose</th>-->
<!--            <th>Spread across</th>-->
<!--            <th>Stage</th>-->
<!--            <th>Hosts</th>-->
<!--        </tr>-->
<!--        </thead>-->
<!--        <tbody>-->
<!--        {#each $rows as row}-->
<!--            <tr>-->
<!--                <td>{row["Title "]}</td>-->
<!--                <td>{row["Publication Year "]}</td>-->
<!--                <td>{row["First Author"]}-->
<!--                <td>{row["AI strain"]}</td>-->
<!--                <td>{row["Epidemic waves"]}</td>-->
<!--                <td>{row[MODEL]}</td>-->
<!--                <td>{row[PURPOSE]}</td>-->
<!--                <td>{row[SPREAD]}</td>-->
<!--                <td>{row[STAGE]}</td>-->
<!--                <td>{row["Hosts "]}</td>-->
<!--            </tr>-->
<!--        {/each}-->
<!--        </tbody>-->
<!--    </table>-->
<!--</div>-->


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