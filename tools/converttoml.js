var toml = require("toml");
var fs = require("fs");

var content = fs.readFileSync('hokus.toml', 'utf8')
var parsed = toml.parse(content)
fs.writeFileSync("hokus.json", JSON.stringify(parsed, null, 2), 'utf8')
