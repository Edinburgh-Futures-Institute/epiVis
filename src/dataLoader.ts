import * as d3 from "d3"

// export let data = await d3.csv(`./src/assets/20_Sept.csv`, d => {

// export let papersFilename = "papers29Sept.csv";
// export let affiliationsFilename = "affTable29Sept.csv";

// export let papersFilename = "papers6Oct.csv";
export let papersFilename = "papers6Oct2.csv";
export let affiliationsFilename = "affiliations6Oct.csv";
export let authorsPapaersFilename = "authors6Oct.csv";

// COLUMN NAMES
export let MODEL = "Model types (=school of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic, 4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Statistical 6.Qualitative 7. Phylogenetic "
export let PURPOSE = "Purpose (of models) (Task performed): 1. Predict when or where the next outbreak occur; 2. Risk distribution (=which risk factors + how much they contribute); 3.Assess surveillance and interventions; 4. Genetic variance & dominance; 5.Plus scoioeconomic analysis. 6. Estimate epidemiological parameteres in compartmental models"
export let SPREAD = "Spread across:  1. Between-farm spread; 2. Within-farm spread; 3. Wildlife-livestock interface; 4. Cross-wildlife species spread; 5. Cross-livestock species spread; 6. Animal-human interface"
export let STAGE = "Stage of outbreak: 1.Preparedness/retrospective analysis; 2. Incursion 3. Exposure; 4.Recovery "


// export let data = await d3.csv(`./data/20_Sept.csv`, d => {
export let data = await d3.csv(`./data/${papersFilename}`, d => {
    d["AI strain"] = trim(d["AI strain"])
    return d
})


// let timeCol = "Period of study (in format for visualisations; yellow= if 2020 forward data inlcuded)"
let timeCol = "Period of study (in format for visualisations)"

export let allYears = []
export let paperToTimes = {}
for (let d of data) {
    let time = d[timeCol]
    if (!time || time == "Not specified ") continue;

    let times = time.split(";")

    times.forEach(t => {
        let [y1, y2] = t.split("-")

        if ((isNaN(y1)) || (y1 == "")) return;
        if ((isNaN(y2)) || (y2 == "")) return;

        allYears.push(parseInt(y1));
        allYears.push(parseInt(y2));

        if (paperToTimes[d["Epic Code "]]) {
            paperToTimes[d["Epic Code "]].push([parseInt(y1), parseInt(y2)])
        } else {
            paperToTimes[d["Epic Code "]] = [[parseInt(y1), parseInt(y2)]]
        }

        // if (!isNaN(y1) && y1 != "") allYears.push(parseInt(y1));
        // if (!isNaN(y2) && y2 != "") allYears.push(parseInt(y2));
    })
}
allYears = [... new Set(allYears)].sort()
export let [yearMin, yearMax] = d3.extent(allYears);



// Influence Network
let influenceLinks = [];
let influenceNodes = [];
for (let d of data) {
    if (nullOrNS(d["Publication Year "]) || nullOrNS(d["Epic Code "])) continue;

    let influenced = d["Methodology Influenced by"]

    let influences = influenced.split(";");

    influenceNodes.push({id: d["Epic Code "], "layer": parseInt(d["Publication Year "])})
    influences.forEach(paper => {
        let year = extractNumbersFromString(paper)[0];
        if (nullOrNS(year)) return;

        influenceLinks.push({"source": paper, "target": d["Epic Code "]})
        influenceNodes.push({"layer": year, "id": paper})
    })
}

function parseDotNodeId(nodeId: string) {
    return nodeId.replace(",", "").replace(" ", "")
}

export function nullOrNS(value: string) {
    if (value == "" || !value || value == "Not specified") return true;
    return false;
}

function trim(value: string) {
    return value.trim()
}

function extractNumbersFromString(inputString: string): number[] {
  const numberRegex = /\d+(\.\d+)?/g;
  const matches = inputString.match(numberRegex);

  if (matches) {
    // Convert the matched strings to numbers
    const numbers = matches.map(match => parseFloat(match));
    return numbers;
  } else {
    return [];
  }
}

export let map = await d3.json("src/assets/ne_10m_admin_0_countries_lakes.json")

export {influenceNodes, influenceLinks}