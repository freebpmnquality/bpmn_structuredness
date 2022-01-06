exports.calculate = function(gateways, totalFlows, totalGateways) {
    var flowsMismatch = 0;
    var gatewaysMismatch = 0;
    var mixedGateways = 0;

    for (var gatewayType in gateways) {
        flowsMismatch += Math.abs(totalFlows.split[gatewayType] - totalFlows.join[gatewayType]);
        gatewaysMismatch += Math.abs(totalGateways.split[gatewayType] - totalGateways.join[gatewayType]);
        mixedGateways += totalGateways.mixed[gatewayType];
    }

    var totalMismatch = Math.max(flowsMismatch, gatewaysMismatch) + mixedGateways;

    return [flowsMismatch, gatewaysMismatch, mixedGateways, totalMismatch];
};