<script lang="ts">
  import Map from "./lib/Map.svelte";
  import Dropdown from "./lib/Dropdown.svelte";

  import {data} from "./dataLoader.ts"
  import {strain} from "./store.ts";

  console.log(data)
  let currentStrain;
  strain.subscribe(value => {
    currentStrain = value;
  })
  // import * as test from "netpanorama-template-viewer"
  // import {NetPanoramaTemplateViewer} from "../node_modules/netpanorama-template-viewer/dist/bundle.js"
  // let NetPanoramaTemplateViewer = require("../node_modules/netpanorama-template-viewer/dist/bundle.js")

  // console.log(NetPanoramaTemplateViewer)
  // NetPanoramaTemplateViewer.render("../templates/template.json", {
  //       fileUrl: "../templates/example.pajek",
  //       nodeColor: "\"red\""
  //     }, "vis1");
</script>

<main>
  <div id="vis1">
  </div>

  <Dropdown value={currentStrain}>
  </Dropdown>

  <Map>
  </Map>

</main>

<style>
</style>
