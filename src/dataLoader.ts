import * as d3 from "d3"



export const MODELS: Record<number, string> = {
    1: "Machine Learning",
    2: "Compartmental",
    3: "Stochastic - Bayesian",
    4: "Mixed Approaches",
    5: "Other Statistical (non stochastic)",
    6: "Qualitative",
    7: "Phylogenetic",
    8: "Simulation",
    9: "Experiment"
}


export enum NodeTypes {
    Person = "Person",
    Paper = "Paper",
    Strain = "Strain",
    Wave = "Wave",
    Institution = "Institution",
    Country = "Country",
    Model = "Model"
}

// export const papersFilename = "papers3Nov.csv";
// export const affiliationsFilename = "affiliations3Nov.csv";
// export const authorsFilename = "authors3Nov.csv";

export const papersFilename = "papers13Jan.csv";
export const affiliationsFilename = "affiliations13Jan.csv";
export const authorsFilename = "authors13Jan.csv";


// // COLUMN NAMES (column dataset)
// export let MODEL = "Model types (=school of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic, 4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Statistical 6.Qualitative 7. Phylogenetic "
// export let PURPOSE = "Purpose (of models) (Task performed): 1. Predict when or where the next outbreak occur; 2. Risk distribution (=which risk factors + how much they contribute); 3.Assess surveillance and interventions; 4. Genetic variance & dominance; 5.Plus scoioeconomic analysis. 6. Estimate epidemiological parameteres in compartmental models"
// export let SPREAD = "Spread across:  1. Between-farm spread; 2. Within-farm spread; 3. Wildlife-livestock interface; 4. Cross-wildlife species spread; 5. Cross-livestock species spread; 6. Animal-human interface"
// export let STAGE = "Stage of outbreak: 1.Preparedness/retrospective analysis; 2. Incursion 3. Exposure; 4.Recovery "
// export let PUBYEAR = "Publication Year "
// let timeCol = "Period of study (in format for visualisations; yellow= if 2020 forward data inlcuded)"


// COLUMN NAMES (column dataset new criteria)
// export let MODEL = "Model types (=sc hool of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic - Bayesian  4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Other Statistical (non stochastic) 6.Qualitative 7. Phylogenetic 8. Simulation 9. Experiments"
export let MODEL = "Model types (=school of thought): 1. Machine learning, 2. Compartmental (deterministic),  3. Stochastic - Bayesian  4. Mixed approaches (Hybrid model or paper with combined approaches) 5. Other Statistical (non stochastic) 6.Qualitative 7. Phylogenetic 8. Simulation 9. Experiments"
export let PURPOSE = "Purpose (of models) (Task performed): 1. Predict when or where the next outbreak occur; 2. Risk distribution (=which risk factors + how much they contribute); 3.Assess surveillance and interventions; 4. Genetic variance & dominance; 5.Plus scoioeconomic analysis. 6. Estimate epidemiological parameteres in compartmental models 7.Scenario"
export let SPREAD = "Spread across:  1. Between-farm spread; 2. Within-farm spread; 3. Wildlife-livestock interface; 4. Cross-wildlife species spread; 5. Cross-livestock species spread; 6. Animal-human interface"
export let STAGE = "Stage of outbreak: 1.Preparedness (lessons learnt from the past); 2. Incursion 3. Exposure; 4.Response, 5.Recovery (endemic nature)"
export let PUBYEAR = "Publication Year "

let timeCol = "Period of study (in format for visualisations; yellow= if 2020 forward data inlcuded)"


export let paperIdToPaper = {};
// export let data = await d3.csv(`./data/${papersFilename}`, d => {
export let data = await d3.csv(`./data/${papersFilename}`, d => {
    d["AI strain"] = parseStrains(d["AI strain"])
    d["Epidemic waves"] = parseStrains(d["Epidemic waves"]).filter(w => w)
    paperIdToPaper[d["Epic Code "]] = d;

    d["Models"] = d[MODEL];

    return d
})
data = data.filter(d => d["Epic Code "])


export let affIdToName = {};
export let affIdToCountry = {};
// export let affiliationsTable = await d3.csv(`./data/${affiliationsFilename}`, d => {
export let affiliationsTable = await d3.csv(`./data/${affiliationsFilename}`, d => {
    affIdToName[d["Affiliation code"]] = d["Afilliation name -"]
    affIdToCountry[d["Affiliation code"]] = d["Country "]
    return d
})


// export let peopleTable = await d3.csv(`./data/${authorsFilename}`, d => {
export let peopleTable = await d3.csv(`./data/${authorsFilename}`, d => {
    return d
})


export let institutionModelTable = [];
export let countryToCountryTable = [];
export let paperWaveTable = [];
export let strainWaveTable = [];
export let waveCountryTable = [];
export let paperModelTable = [];


export let paperIdToAuthors: Object = {};
export let authorToCountry: Object = {};

createLinksTables();

function createLinksTables() {
    peopleTable.forEach(author => {
        let paperId = author["Paper associated "];
        let institution = author["Affiliation code 1"];

        let paper = paperIdToPaper[paperId.toUpperCase()];
        let models = paper ? paper[MODEL] : null;

        let authorName = author.Author;

        let authorCountry = affIdToCountry[institution];
        authorToCountry[authorName] = authorCountry;

        if (paperIdToAuthors[paperId]) {
            paperIdToAuthors[paperId].push(authorName);
        } else {
            paperIdToAuthors[paperId] = [authorName];
        }

        if (models) {
            models = parseModels(models);

            models.forEach(model => {
                institutionModelTable.push({
                    Model: model,
                    Institution: institution
                })
            })
        }
    })

    // This does not create link between the same country (such as France > France)
    for (let [paper, authors] of Object.entries(paperIdToAuthors)) {
        let countries = authors.map(a => authorToCountry[a])
        countries = [...new Set(countries)]
        for (let i = 0; i < countries.length; i++) {
            for (let j = i + 1; j < countries.length; j++) {
                countryToCountryTable.push({Country1: countries[i], Country2: countries[j]})
            }
        }
    }

    for (let paper of data) {
        let strains = paper["AI strain"]
        let waves = paper["Epidemic waves"]

        for (let w: string of waves) {
            paperWaveTable.push({Paper: paper["Epic Code "], Wave: w})
            waveCountryTable.push({Country: paper["Region of study "], Wave: w})
        }

        for (let st of strains) {
            for (let w: string of waves) {
                if (w.toLowerCase().includes(st.toLowerCase())) {
                    strainWaveTable.push({Strain: st, Wave: w})
                }
            }
        }


        let models = parseModels(paper[MODEL]);

        models.forEach(m => {
            if (m != "4") {
                // paperModelTable.push({Model: MODELS[m], Paper: paper["Epic Code "]});
                paperModelTable.push({Model: m, Paper: paper["Epic Code "]});
            }
        })
    }
}


export function parseModels(models) {
    if (models) {
        return models.split("(").map(d => d.split("").map(d2 => d2.split("+").map(d => d.split(",").map(d => d.split(")"))))).flat(Infinity).filter(m => !["", " ", "  ", "r", "e", "v", "i", "w"].includes(m));
    }
    return []
}

export function parseStrains(strains) {
    let strainsArray: Array<string> = strains.split(";").map(s => s.trim());
    return strainsArray;
}

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
allYears = [...new Set(allYears)].sort()
export let [yearMin, yearMax] = d3.extent(allYears);


// Influence Network
let influenceLinks = [];
let influenceNodes = [];
for (let d of data) {
    if (nullOrNS(d["Publication Year "]) || nullOrNS(d["Epic Code "])) continue;

    let influenced = d["Methodology Influenced by"]
    let influences = influenced.split(";");

    let type: number;
    let influenceType = d["Model heavily relied on: 1. Yes, 2. No"]
    if (influenceType?.includes("1")) {
        type = 1;
    } else {
        type = 2;
    }

    influenceNodes.push({id: d["Epic Code "], "layer": parseInt(d["Publication Year "])})
    influences.forEach(paper => {
        let year = extractNumbersFromString(paper)[0];
        if (nullOrNS(year)) return;

        influenceLinks.push({"source": paper, "target": d["Epic Code "], "influenceType": type})
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



export const nodeTypeColorScale = d3.scaleOrdinal(Object.values(NodeTypes), [
    "lightblue",
    "lightgreen",
    "red",
    "purple",
    "orange",
    "brown",
    "yellow"
])



// COLUMNS FOR THE HEATMAP
const c1 = "Assumptions mentioned (Yes/No/Limited)"
const c2 = "Assumptions included in Mode/review  Design (Yes/No?limited)"
const c3 = "Impacts mentioned (YES/NO?Limited)"
const c4 = "Impacts included in the model/review design (YES/No)"
const c5 = "Nature of impacts (Positive/Negative/Mixed)"
const c6 = "Biases mentioned (Yes/No/Insufficiently mentioned)"
const c7 = "Impacts of biases explained (Yes/No/Insufficiently explained)"
const c8 = "Uncertainty explained (YES/NO/Insufficiently explained)"
const c9 = "Impacts of uncertainty explained (YES/NO/Insufficiently explained)"
const c10 = "Overall reporting (Sufficient/Insufficient)"
export const allCols = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];

// export let map = await d3.json("src/assets/ne_10m_admin_0_countries_lakes.json")
export let map = await d3.json("./data/ne_10m_admin_0_countries_lakes.json")

export {influenceNodes, influenceLinks}