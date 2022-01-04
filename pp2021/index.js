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

fs.readdirSync(folder).forEach(file => {
    var modelXML = fs.readFileSync(folder + file, "utf8");

    xml2js.parseString(modelXML, (err, result) => {
        if (!err && result.definitions) {
            var processList = Array.isArray(result.definitions.process) ? result.definitions.process : [result.definitions.process];

            var [totalFlows, totalGateways, processLength] = model.prepare(gateways, processList);

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

            results.push(resultObj);

            console.log("Processing...", file);
        }
    });
});

fs.writeFileSync("output.json", JSON.stringify(results), "utf8");