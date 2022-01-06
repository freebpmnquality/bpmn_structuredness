exports.formulate = function(gateways, detectedErrors) {
    var recommendationPatterns = {
        flows: (gatewayType) => "Flows splitted and joined by " + gatewayType + " gateways do not match",
        gateways: (gatewayType) => "Split and join " + gatewayType + " gateways do not match",
        mixed: (gatewayType) => gatewayType + " gateways are neither splits nor joins"
    };

    var recommendations = [];

    for (var gatewayType in gateways) {
        var typeName = gateways[gatewayType].replace("Gateway", "").replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

        if (detectedErrors.flows[gatewayType] > 0) {
            recommendations.push(recommendationPatterns.flows(typeName));
        }

        if (detectedErrors.gateways[gatewayType] > 0) {
            recommendations.push(recommendationPatterns.gateways(typeName));
        }

        if (detectedErrors.mixed[gatewayType] > 0) {
            recommendations.push(recommendationPatterns.mixed(typeName));
        }
    }

    return recommendations;
};