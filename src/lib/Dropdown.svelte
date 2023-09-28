<script lang="ts">
  export let value: string;
  let possibleValues: string[];

</script>

<!--<button on:click={increment}>-->
<!--  count is {count}-->
<!--</button>-->

<form>
  <label for="cars">Strain:</label>
  <select bind:value name="cars" id="cars">
    <option value="volvo">Volvo</option>
    <option value="saab">Saab</option>
    <option value="opel">Opel</option>
    <option value="audi">Audi</option>
  </select>
  {value}
</form>
