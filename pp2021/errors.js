exports.detect = function(gateways, totalFlows, totalGateways) {
    var detectedErrors = {
        flows: {
            or: 0,
            xor: 0,
            and: 0,
            event: 0,
            complex: 0
        },
        gateways: {
            or: 0,
            xor: 0,
            and: 0,
            event: 0,
            complex: 0
        }
    };

    for (var gatewayType in gateways) {
        detectedErrors.flows[gatewayType] = (totalFlows.split[gatewayType] !== totalFlows.join[gatewayType]) && (totalFlows.split[gatewayType] > 0 || totalFlows.join[gatewayType] > 0) ? 1 : 0;

        detectedErrors.gateways[gatewayType] = (totalGateways.split[gatewayType] !== totalGateways.join[gatewayType]) && (totalGateways.split[gatewayType] > 0 || totalGateways.join[gatewayType] > 0) ? 1 : 0;
    }

    return detectedErrors;
};