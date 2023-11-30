<script lang="ts">
    export let name;
    export let value: string;
    export let allValues: string[];
    // export let table: Record<any, any>;
    export let table;
</script>


<form>
    <label for="cars">{name}:</label>
    <select bind:value name="cars" id="cars">
        <option value=""></option>
                {#each allValues as value}
                    <option value={value}>{table ? table[value] : value}</option>
<!--                    <option value={value}>{value}</option>-->
                {/each}

        <!--{#if {table}}-->
        <!--    {#each Object.values(table) as value}-->
        <!--        <option value={value}>{value}</option>-->
        <!--    {/each}-->
        <!--{:else}-->
        <!--    {#each allValues as value}-->
        <!--        <option value={value}>{value}</option>-->
        <!--    {/each}-->
        <!--{/if}-->

    </select>
    {value}
</form>

<style>
    form {
        display: inline-block;
        padding-right: 5%;
    }

    select {
        max-width: 200px;
    }
</style>
