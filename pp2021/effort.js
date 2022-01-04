exports.estimate = function(processLength, gateways, detectedErrors) {
    var stages = {
        design: 1,
        implementation: 6.5,
        testing: 15,
        maintenance: 100
    };

    var hours = 152;
    var LOC = 7;

    var effort = {};

    for (var s in stages) {
        var coeff = stages[s];

        var a = 0.0429 * processLength + 2.2714;
        var b = 0.0054 * processLength + 1.0323;

        var KLOC = LOC * (() => {
            var sum = 0;

            for (var gatewayType in gateways) {
                sum += detectedErrors.flows[gatewayType] + detectedErrors.gateways[gatewayType];
            }

            return sum;
        })() / 1000;

        effort[s] = coeff * hours * a * Math.pow(KLOC, b);
    }

    return effort;
};