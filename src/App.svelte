<script lang="ts">
    import Map from "./lib/Map.svelte";
    import Dropdown from "./lib/Dropdown.svelte";

    import {data} from "./dataLoader.ts"
    import {strain} from "./store.ts";


    let allIstitutions = data.reduce((d0, d) => d0.concat(d["Affiliation of 1st author"].split(",").concat(d["Affiliation of 2nd author"].split(",")).concat(d["Affiliation of 3rd author"].split(",")).concat(d["Affiliation of Forth th author"].split(",").concat(d["Affiliation of Fifth th author"].split(",")))), [])
    allIstitutions = [ ... new Set(allIstitutions)]
    let allStrains = [ ... new Set(data.map(d => d ["AI strain"]))];
    let allModels = [ ... new Set(data.map(d => d ["Model types (=school of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic, 4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Statistical 6.Qualitative 7. Phylogenetic "]))];

    let currentStrain;
    let currentIstitution;
    let currentModel;
    // strain.subscribe(value => {
    //     currentStrain = value;
    // })
    // import * as test from "netpanorama-template-viewer"
    // import {NetPanoramaTemplateViewer} from "../node_modules/netpanorama-template-viewer/dist/bundle.js"
    // let NetPanoramaTemplateViewer = require("../node_modules/netpanorama-template-viewer/dist/bundle.js")

    async function render() {
    await NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/wholeNet.json", {
        filename: "25_Sept.csv",
    }, "vis1");

    NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/projPerson.json", {
        filename: "25_Sept.csv",
    }, "vis2");

    NetPanoramaTemplateViewer.render("../netpanorama-vis/templates/PaperInfluence.json", {
        filename: "25_Sept.csv",
    }, "vis3");
    }

    render()
</script>

<main>
    <Dropdown name="Strains" value={currentStrain} allValues={allStrains}>
    </Dropdown>
    <Dropdown name="Institutions" value={currentIstitution} allValues={allIstitutions}>
    </Dropdown>
    <Dropdown name="Model Types" value={currentModel} allValues={allModels}>
    </Dropdown>

    <Map>
    </Map>

    <div class="vis-container">
        <div id="vis1" class="vis-component">
        </div>
    </div>

    <div class="vis-container">
        <div id="vis2" class="vis-component">
        </div>
    </div>

    <div class="vis-container">
        <div id="vis3" class="vis-component">
        </div>
    </div>

</main>

<style>
    /*vis-container {*/
    /*    min-height: 50vh;*/
    /*!*display: inline-block;*!*/
    /*}*/

    .vis-component {
        /*display: inline-block;*/
        /*width: 40vw;*/
        /*width: 40vw;*/
        height: 100vh;
    }
</style>
