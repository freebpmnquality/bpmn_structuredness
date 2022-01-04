var fs = require("fs");
var xml2js = require("xml2js");

var model = require("./model");
var mismatch = require("./mismatch");
var errors = require("./errors");
var effort = require("./effort");
var recommendations = require("./recommendations");

var folder = "models/";

var gateways = {
    or: "inclusiveGateway",
    xor: "exclusiveGateway",
    and: "parallelGateway",
    event: "eventBasedGateway",
    complex: "complexGateway"
};

var results = [];

var flowErrors = 0;
var gatewayErrors = 0;

fs.readdirSync(folder).forEach(file => {
    var modelXML = fs.readFileSync(folder + file, "utf8");

    xml2js.parseString(modelXML, (err, result) => {
        if (!err && result.definitions) {
            var processList = Array.isArray(result.definitions.process) ? result.definitions.process : [result.definitions.process];

            var processData = model.prepare(gateways, processList);

            for (var i in processData) {
                var [totalFlows, totalGateways, processLength] = processData[i];

                var [flowsMismatch, gatewaysMismatch, totalMismatch] = mismatch.calculate(gateways, totalFlows, totalGateways);

                var detectedErrors = errors.detect(gateways, totalFlows, totalGateways);

                var resultObj = {
                    file: file,
                    flowsMismatch: flowsMismatch,
                    gatewaysMismatch: gatewaysMismatch,
                    totalMismatch: totalMismatch,
                    detectedErrors: detectedErrors,
                    effort: effort.estimate(processLength, gateways, detectedErrors),
                    recommendations: recommendations.formulate(gateways, detectedErrors)
                };

                if (flowsMismatch > 0) flowErrors++;
                if (gatewaysMismatch > 0) gatewayErrors++;

                results.push(resultObj);

                console.log("Processing...", file);
            }
        }
    });
});

console.log(results.length, "models processed");

console.log(flowErrors, "models with mismatched flows");
console.log(gatewayErrors, "models with mismatched gateways");

fs.writeFileSync("output.json", JSON.stringify(results), "utf8");