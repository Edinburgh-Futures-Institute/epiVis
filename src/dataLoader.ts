import * as d3 from "d3"
import * as reorder from "reorder.js";



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

export const modelTable = Object.entries(MODELS).map(v => {
    return {id: v[0], model: v[1]};
})

export enum NodeTypes {
    Person = "Person",
    Paper = "Paper",
    Strain = "Strain",
    Wave = "Wave",
    Institution = "Institution",
    Country = "Country",
    Model = "Model"
}

// export const papersFilename = "papers13Jan.csv";

// New version with the lots of new ethic colored columns
export const papersFilename = "papers13JanNEW2.csv";
// export const papersFilename = "papers13JanNEW.csv";

export const affiliationsFilename = "affiliations13Jan.csv";
// export const affiliationsFilename = "institutionGPT.csv";

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


export let countriesInTheData = [...new Set(data.map(d => d["Region of study "].toLowerCase()))]

export let affIdToName = {};
export let affIdToCountry = {};
// export let affiliationsTable = await d3.csv(`./data/${affiliationsFilename}`, d => {
export let affiliationsTable = await d3.csv(`./data/${affiliationsFilename}`, d => {
    affIdToName[d["Affiliation code"]] = d["Afilliation name -"]
    affIdToCountry[d["Affiliation code"]] = d["Country "]
    return d
})


export let peopleTable = await d3.csv(`./data/${authorsFilename}`, d => {
    return d
})


export let institutionModelTable = [];
export let countryToCountryTable = [];
export let paperWaveTable = [];
export let strainWaveTable = [];
export let waveCountryTable = [];
export let paperModelTable = [];


// Used for the circular layout
export let paperAffiliationTable = [];


export let paperIdToAuthors: Object = {};
export let authorToCountry: Object = {};

createLinksTables();

function createLinksTables() {
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
        paper[MODEL] = models
        paper["Models"] = models

        models.forEach(m => {
            if (m != "4") {
                // paperModelTable.push({Model: MODELS[m], Paper: paper["Epic Code "]});
                paperModelTable.push({Model: m, Paper: paper["Epic Code "]});
            }
        })
    }


    peopleTable.forEach(author => {
        let paperId = author["Paper associated "];
        let affiliation = author["Affiliation code 1"];

        // let paper = paperIdToPaper[paperId.toUpperCase()];
        let paper = paperIdToPaper[paperId.toLowerCase()];

        let models = paper ? paper[MODEL] : null;

        let authorName = author.Author;

        let authorCountry = affIdToCountry[affiliation];
        authorToCountry[authorName] = authorCountry;

        if (paperIdToAuthors[paperId]) {
            paperIdToAuthors[paperId].push(authorName);
        } else {
            paperIdToAuthors[paperId] = [authorName];
        }
        
        paperAffiliationTable.push({Paper: paperId, Affiliation: affiliation});

        if (models) {
            models.forEach(model => {
                institutionModelTable.push({
                    Model: model,
                    Institution: affiliation
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
}


export function parseModels(models) {
    // if (models && Array.isArray(models)) {
    if (models) {
        let modelList = models.split("(").map(d => d.split("").map(d2 => d2.split("+").map(d => d.split(",").map(d => d.split(")"))))).flat(Infinity).filter(m => !["", " ", "  ", "r", "e", "v", "i", "w"].includes(m));
        return modelList
    }
    return [];
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

export let paperToInfluences = {};
export let paperIdTopaperObject = {}

for (let d of data) {
    if (nullOrNS(d["Publication Year "]) || nullOrNS(d["Epic Code "])) continue;

    let influenced = d["Methodology Influenced by"]
    let influences = influenced.split(";").map(p => p.trim());
    // influences = influences.map(influence => {
    //     let year = influence.slice(-4);
    //     return {name: influence, year: year}
    // })

    let influenceType = d["Model heavily relied on: 1. Yes, 2. No"]
    // let type: number = (influenceType?.includes("1")) ? 1 : 2;

    let influencesHeavy = [];
    if (typeof influenceType == "string" && influenceType.includes("(")) {
        influencesHeavy = influenceType.split("(")[1].split(")")[0].split(";")
    }
    influencesHeavy = influencesHeavy.map(p => p.trim());

    influenceNodes.push({id: d["Epic Code "], "layer": parseInt(d["Publication Year "])})
    // influences.forEach(paper => {
    for (let paper of influences) {
        let year = extractNumbersFromString(paper)[0];
        if (nullOrNS(year)) continue;

        let type = influencesHeavy.includes(paper) ? 1 : 2;

        // console.log(paper, d["Epic Code "])
        influenceLinks.push({"source": paper, "target": d["Epic Code "], "influenceType": type})
        influenceNodes.push({"layer": year, "id": paper})


        let paperObject = {"name": paper, "year": year}
        paperIdTopaperObject[paper] = paperObject;


        // Save paper and type of influence
        if (paperToInfluences[d["Epic Code "]]) {
            paperToInfluences[d["Epic Code "]].push([paperObject, type] )
        } else {
            paperToInfluences[d["Epic Code "]] = [[paperObject, type]]
        }
    }
}



function buildInfluenceOrder() {
    let indexToNodeId = {};
    let idToNodeIndex = {};

    influenceNodes.forEach((n, i) => {
        indexToNodeId[i] = n.id
        idToNodeIndex[n.id] = i
        n.id = i;
    })

    influenceLinks.forEach(link => {
        link.source = idToNodeIndex[link.source]
        link.target = idToNodeIndex[link.target]
    })

    const graph = reorder.graph(influenceNodes, influenceLinks, true).init();

    const perms = reorder.barycenter_order(graph);
    let papersIds = perms[0].map(n => indexToNodeId[n])
    let influencesIds = perms[1].map(n => indexToNodeId[n])

    influencesIds.sort((p1, p2) => {
        return paperIdTopaperObject[p1].year - paperIdTopaperObject[p2].year;
    })

    let papersFirstyear = [];
    let year0 = null;
    influencesIds.forEach(paper => {
        let year1 = paperIdTopaperObject[paper].year
        if (year1 != year0) {
            papersFirstyear.push(paper);
            year0 = year1;
        }
    })

    return [influencesIds, papersIds, papersFirstyear]
}

export let [influencesIds, papersIds, papersFirstYear] = buildInfluenceOrder();


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


//
// // COLUMNS FOR THE HEATMAP
// const c1 = "Assumptions mentioned (Yes/No/Limited)"
// const c2 = "Assumptions included in Mode/review  Design (Yes/No?limited)"
// const c3 = "Impacts mentioned (YES/NO?Limited)"
// const c4 = "Impacts included in the model/review design (YES/No)"
// const c5 = "Nature of impacts (Positive/Negative/Mixed)"
// const c6 = "Biases mentioned (Yes/No/Insufficiently mentioned)"
// const c7 = "Impacts of biases explained (Yes/No/Insufficiently explained)"
// const c8 = "Uncertainty explained (YES/NO/Insufficiently explained)"
// const c9 = "Impacts of uncertainty explained (YES/NO/Insufficiently explained)"
// const c10 = "Overall reporting (Sufficient/Insufficient)"
// export const allCols = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];



// NEW COLUMNS with MODEL tab sheet
const c1 = "Constraints: 1. No constraints mentioned; 2.There are constraints 3. Not clarified  "
const c2 = " Multiplicity"
const c3 = "Results of similar studies"
const c4 = "Mentions impacts"
const c5 = "Impacts BY DESIGN: 1.Not reported, 2.Claimed but not substantiated by nodel design ; 3. Sbstantiated by model design; 4. N/A (for review)  "
const c6 = "Mentions impacts and type  of impacts: 1. Not reported; 2. Postive impact, 3. Negative impact, 4. Mixed impacts, 5. No impact;"
const c7 = "Trade-offs"
const c8 = "Opportunity costs"
const c9 = " Reasons for differences observed"
const c10 = "Does they explain factors contrinuting to viability? Does they inlude them in the model design? 1. Not discussed AT ALL; 2. Discussed but not inlcuded; 3. Discussed and inlcuded in the model/review design; 4. Mixed: 2 +3"
const c11 = "Lack of knowledge attributable to variability: 1. No; 2.Partially; 3.Fully; 4.Attributed to methods"
const c12 = "Lack of knowledge attributable to uncertainty";
const c13 = "Full history of model development: 1.Yes;  2.No; 3. Very clealrly  "
const c14 = "Validated using independent data ";
const c15 = "Clear documentation: 1. very clear; 2.clear; 3. semi-clear; 4. unlcear";
const c16 = "Biases? Direction and magnitude? Efforts to address bias?: 1. Not mentioned; 2 Simple metioned; 3. Direction and magnitude; 4. Efforts to address the biases  ";
const c17 = "Conflicts of interest: 1. No conflict; 2.There is conflict; 3. Not clarified  ";
const c18 = "Missing values";
const c19 = "Code open source ";
const c20 = "Assumption -BY DESIGN:   1.Simply mentioned and inlcuded; 2. Well mentioned and included; 3. Mentioned but NOT inlcuded;  4. NOT mentioned at ALL ";
const c21 = "Verified: 1. Yes, 2. No , 3. Unknown ";
const c22 = " Validated: 1. Yes; 2.No;  3.N/A (for reviews)";
const c23 = "Sources and magnitude of uncertainty in the\r\nmodel—are these associated with parametric uncertainty or\r\nmodel selection? 1.parametric uncertainty, 2. model selection; 3. No associated"
const c24 = "If interventions based on model predictions are implemented in\r\nthe real world, can the predicted benefits and harms to different\r\nindividuals and subpopulations be quantified? 1. Quantified; 2.Not quantified; 3. Unknown"
const c25 = "Case-control study: 1. Yes; 2.No";

// These contain long text
const c26 = "Inter-disciplinarity (NO=highlighted in red) "
// const c27 = "Model heavily relied on: 1. Yes, 2. No"

const c28 = "Model performance metrices"
const c29 = "How many red areas?";


// TODO: col 23 and 24 to add later
export const allColsUnordered = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c25, c26, c28, c29];
// export const allCols = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10, c11, c12, c13, c14, c15, c16, c17, c18, c19, c20, c21, c22, c23, c24, c25, c26, c28, c29];
// export const allCols = [c1, c2, c3, c4, c5, c6, c7, c8, c9, c10];


export const colToGroup: Record<string, any> = {
    [c1]: "T",
    [c2]: "T",
    [c3]: "T",
    [c4]: ["T", "B"],
    [c5]: "T",
    [c6]: ["T", "B"],
    [c7]: ["B", "J"],
    [c8]: ["B", "J"],
    [c9]: "T",
    [c10]: "T",
    [c11]: "J",
    [c12]: "J",
    [c13]: "I",
    [c14]: "I",
    [c15]: "T",
    [c16]: "T",
    [c17]: "T",
    [c18]: "T",
    [c19]: "T",
    [c20]: "T",
    [c21]: "B",
    [c22]: "B",
    [c25]: "T",
    [c26]: ["I", "T"],
    [c28]: "I",
    [c29]: "T"
}

export const groupToColSorted = Object.groupBy(
    Object.entries(colToGroup), (v) => {
        return v[1];
    }
)

export const allCols = Object.values(groupToColSorted).reduce((a, b) => a.concat(b.map(v => v[0])), []);


export const colColor = d3.scaleOrdinal(["T", "I", "J", "B"], ["orange", "lightblue", "green", "purple"]).unknown("white");



export let map = await d3.json("./data/ne_10m_admin_0_countries_lakes.json")


export {influenceNodes, influenceLinks}