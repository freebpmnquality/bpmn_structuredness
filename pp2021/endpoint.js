var express = require("express");
var fs = require("fs");

var app = express();
var port = 3000;

app.get("/", (req, res) => {
    var outputJSON = fs.readFileSync("output.json", "utf8");

    res.send(JSON.parse(outputJSON));
});

app.listen(port, () => {
    console.log("Listening at the port", port);
});