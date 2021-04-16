function suggestChanges(processStructure) {
    let results = {};

    for (let gatewayType in processStructure.splits) {
        results[gatewayType] = {
            splits: {
                nodes: processStructure.splits[gatewayType]['nodes'] != processStructure.joins[gatewayType]['nodes'] &&
                    processStructure.splits[gatewayType]['nodes'] > 0 ? 1 : 0,
                arcs: processStructure.splits[gatewayType]['arcs'] != processStructure.joins[gatewayType]['arcs'] &&
                    processStructure.splits[gatewayType]['arcs'] > 0 ? 1 : 0
            },
            joins: {
                nodes: processStructure.splits[gatewayType]['nodes'] != processStructure.joins[gatewayType]['nodes'] &&
                    processStructure.joins[gatewayType]['nodes'] > 0 ? 1 : 0,
                arcs: processStructure.splits[gatewayType]['arcs'] != processStructure.joins[gatewayType]['arcs'] &&
                    processStructure.joins[gatewayType]['arcs'] > 0 ? 1 : 0
            }
        };
    }

    for (let gatewayType in processStructure.uncertainties) {
        if (results[gatewayType] === undefined) {
            results[gatewayType] = {};
        }

        results[gatewayType].uncertainties = processStructure.uncertainties[gatewayType] > 0 ? 1 : 0;
    }

    return results;
}

function estimateCost(results) {
    let efforts = 0;

    for (let gatewayType in results) {

        if (results[gatewayType].splits) {
            efforts += results[gatewayType].splits.nodes;
        }

        if (results[gatewayType].joins) {
            efforts += results[gatewayType].joins.nodes;
        }

        if (results[gatewayType].splits) {
            efforts += results[gatewayType].splits.arcs;
        }

        if (results[gatewayType].joins) {
            efforts += results[gatewayType].joins.arcs;
        }

        if (results[gatewayType].uncertainties) {
            efforts += results[gatewayType].uncertainties;
        }
    }

    const model = function(efforts, stage) {
        const hours = 152;
        const a = 2.4;
        const b = 1.05;

        return stage * hours * a * Math.pow(10e-4 * efforts, b);
    };

    return {
        design: model(efforts, 1),
        implementation: model(efforts, 6.5),
        testing: model(efforts, 15),
        maintenance: model(efforts, 100)
    };
}

module.exports.suggestChanges = suggestChanges;
module.exports.estimateCost = estimateCost;