exports.calculate = function(gateways, totalFlows, totalGateways) {
    var flowsMismatch = 0;
    var gatewaysMismatch = 0;

    for (var gatewayType in gateways) {
        flowsMismatch += Math.abs(totalFlows.split[gatewayType] - totalFlows.join[gatewayType]);

        gatewaysMismatch += Math.abs(totalGateways.split[gatewayType] - totalGateways.join[gatewayType]);
    }

    var totalMismatch = Math.max(flowsMismatch, gatewaysMismatch);

    return [flowsMismatch, gatewaysMismatch, totalMismatch];
};