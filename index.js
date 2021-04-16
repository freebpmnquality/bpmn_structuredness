const fs = require('fs');
const parser = require('./app/bpmn/parser')
const measure = require('./app/bpmn/measure')
const suggestion = require('./app/bpmn/suggestion')

const folder = './input/';

var stream = fs.createWriteStream('./out.json');

stream.once('open', function(fd) {
    var results = [];

    fs.readdirSync(folder).forEach(file => {
        let xmlModel = fs.readFileSync(folder + file, 'utf8');
        let structure = parser.parse(xmlModel);

        for (let process in structure) {
            let model = { file: file };

            model.process = process;
            model.structure = structure[process];

            let originalMM = measure.originalMismatch(structure[process]);
            let modifiedMM = measure.modifiedMismatch(structure[process]);

            model.originalMM = originalMM;
            model.modifiedMM = modifiedMM;

            model.suggestion = {};
            model.estimation = {};

            if (modifiedMM > 0) {
                let _suggestion = suggestion.suggestChanges(structure[process]);
                let estimation = suggestion.estimateCost(_suggestion);

                model.suggestion = _suggestion;
                model.estimation = estimation;
            }

            results.push(model);
        }
    });

    stream.write(JSON.stringify(results));
    stream.end();
});