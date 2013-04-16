/*jshint strict:false*/
/*global CasperError console phantom require*/

var casper = require("casper").create({
	logLevel: "debug"
});

casper.start("http://localhost:3000/");

casper.then(function() {
	this.test.assertTitle("Express", "Express homepage title is the one expected");
});
casper.run(function() {
	this.exit();
});
