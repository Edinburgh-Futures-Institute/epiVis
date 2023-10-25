<script lang="ts">
    import {DataHandler} from '@vincjo/datatables'
    import {MODEL, PURPOSE, SPREAD, STAGE} from "../dataLoader.ts";
    // import { someData } from './data'

    export let filteredData;

    let handler, rows
    $: handler = new DataHandler(filteredData, {rowsPerPage: 20})
    $: rows = handler.getRows()
</script>

<div>
    <table>
        <thead>
        <tr>
            <th>Title</th>
            <th>Year</th>
            <th>First Author</th>
<!--            <th>Second Author</th>-->
<!--            <th>Third Author</th>-->
            <th>AI strain</th>
            <th>Epidemic wave</th>
            <th>Model type</th>
            <th>Purpose</th>
            <th>Spread across</th>
            <th>Stage</th>
            <th>Hosts</th>
        </tr>
        </thead>
        <tbody>
        {#each $rows as row}
            <tr>
                <td>{row["Title "]}</td>
                <td>{row["Publication Year "]}</td>
                <td>{row["First Author"]}
                <td>{row["AI strain"]}</td>
                <td>{row["Epidemic wave"]}</td>
                <td>{row[MODEL]}</td>
                <td>{row[PURPOSE]}</td>
                <td>{row[SPREAD]}</td>
                <td>{row[STAGE]}</td>
                <td>{row["Hosts "]}</td>
            </tr>
        {/each}
        </tbody>
    </table>
</div>

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