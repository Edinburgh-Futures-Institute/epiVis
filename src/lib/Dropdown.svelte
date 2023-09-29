<script lang="ts">
    export let name;
  export let value: string;
  export let allValues: string[];

  let possibleValues: string[];
</script>

<!--<button on:click={increment}>-->
<!--  count is {count}-->
<!--</button>-->

<form>
  <label for="cars">{name}:</label>
<!--  <select bind:value name="cars" id="cars">-->
  <select bind:value name="cars" id="cars">
<!--    <option value="volvo">Volvo</option>-->
<!--    <option value="saab">Saab</option>-->
<!--    <option value="opel">Opel</option>-->
<!--    <option value="audi">Audi</option>-->

    {#each allValues as value}
    <option value={value}>{value}</option>
    {/each}
  </select>



  {value}
</form>

<style>
  form {
    display: inline-block;
    padding-right: 5%;
  }
</style>
