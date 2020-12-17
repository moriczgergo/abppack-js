var fs = require("fs");
var path = require("path");

var tests = [];

var files = fs.readdirSync(__dirname, {encoding: "utf8"});
files.forEach(file => {
    if (file.endsWith(".test.js")) {
        var x = require("./" + file);
        tests.push({name: file, tests: x});
    }
});

tests.forEach(t => {
    console.log(t.name);
    var good = 0;
    t.tests.forEach(x => {
        process.stdout.write(x.name + " ");
        try {
            var res = x();
            if (res !== true) {
                console.log("NON-TRUE", res);
            } else {
                console.log("OK");
                good++;
            }
        } catch (e) {
            console.log("ERROR");
            console.error(e);
        }
    });
    console.log(good + "/" + t.tests.length);
    t.good = good;
    console.log();
});

var goodTests = tests.filter(x => x.good == x.tests.length).length;
console.log(goodTests + "/" + tests.length);

process.exit(goodTests < tests.length ? -1 : 0);