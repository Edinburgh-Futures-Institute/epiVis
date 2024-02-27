import {influenceLinks, influenceNodes} from "./dataLoader.ts";

function dotGraph() {
        let dot = "digraph { rankdir=LR;"

        let rankKey = "layer"

        let rankToNodesIds: Record<string, (string | number)[]> = {};
        influenceNodes.forEach(n => {
            const rank = n[rankKey]
            if (rankToNodesIds[rank]) {
                rankToNodesIds[rank].push(n.id)
            } else {
                rankToNodesIds[rank] = [n.id]
            }
        })

        for (let [rank, nodesIds] of Object.entries(rankToNodesIds)) {
            nodesIds = nodesIds.map(v => `"${v}"`)
            dot += `{rank=same; ${nodesIds.join(",")}}`
        }

        influenceLinks.forEach(link => {
            // const dotLink = `${link.source.id} -> ${link.target.id};`
            const dotLink = `"${link.source}" -> "${link.target}";`
            dot += dotLink
        })

        dot += "}";
        return dot
    }

    function dotGraphTime() {
        let dot = "digraph { rankdir=LR;"
        let rankKey = "layer"

        let rankToNodesIds: Record<string, (string | number)[]> = {};
        influenceNodes.forEach(n => {
            const rank = n[rankKey]
            if (rankToNodesIds[rank]) {
                rankToNodesIds[rank].push(n.id)
            } else {
                rankToNodesIds[rank] = [n.id]
            }
        })

        for (let [rank, nodesIds] of Object.entries(rankToNodesIds)) {
            nodesIds = nodesIds.map(v => `"${v}"`)
            dot += `{rank=same; ${rank}, ${nodesIds.join(",")}}`
        }

        influenceLinks.forEach(link => {
            let type = (link.influenceType == 1) ? "solid" : "dotted";
            let color = (link.influenceType == 1) ? "red" : "black";

            // const dotLink = `"${link.source}" -> "${link.target}" [style="${type}"];`;
            const dotLink = `"${link.source}" -> "${link.target}" [color="${color}"];`;
            dot += dotLink;
        })

        let ranks = Object.keys(rankToNodesIds);
        for (let i = 0; i < ranks.length - 2; i++) {
            let r = ranks[i];
            let r2 = ranks[i + 1];
            dot += `${r} -> ${r2};`
        }

        dot += "}";
        return dot
    }