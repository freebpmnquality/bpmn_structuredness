exports.prepare = function(gateways, processList) {
    var processData = [];

    for (var i in processList) {
        var totalFlows = {
            split: {
                or: 0,
                xor: 0,
                and: 0,
                event: 0,
                complex: 0
            },
            join: {
                or: 0,
                xor: 0,
                and: 0,
                event: 0,
                complex: 0
            }
        };

        var totalGateways = {
            split: {
                or: 0,
                xor: 0,
                and: 0,
                event: 0,
                complex: 0
            },
            join: {
                or: 0,
                xor: 0,
                and: 0,
                event: 0,
                complex: 0
            }
        };

        var processLength = 0;

        var process = processList[i];

        if (!process) continue;

        if (process.startEvent) {
            processLength += process.startEvent.length;
        }

        if (process.task) {
            processLength += process.task.length;
        }

        if (process.endEvent) {
            processLength += process.endEvent.length;
        }

        for (var gatewayType in gateways) {
            var gatewayList = process[gateways[gatewayType]];

            if (!gatewayList) continue;

            processLength += gatewayList.length;

            for (var j in gatewayList) {
                var gateway = gatewayList[j];

                var incoming = gateway.incoming ? gateway.incoming.length : 0;
                var outgoing = gateway.outgoing ? gateway.outgoing.length : 0;

                var degree = incoming + outgoing;

                if (incoming === 1 && outgoing > 1) {
                    totalGateways.split[gatewayType]++;
                    totalFlows.split[gatewayType] += degree;
                }

                if (incoming > 1 && outgoing === 1) {
                    totalGateways.join[gatewayType]++;
                    totalFlows.join[gatewayType] += degree;
                }
            }
        }

        processData.push([totalFlows, totalGateways, processLength]);
    }

    return processData;
};