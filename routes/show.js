/*global require console exports*/
exports.show = function (req, res) {
	'use strict';

	var fs = require('fs'),

	fs.readFile("/tmp/pic34.png", "binary", function(error, file) {
		if(error) {
			response.writeHead(500, {"Content-Type": "text/plain"});
			response.write(error + "\n");
			response.end();
		} else {
			response.writeHead(200, {"Content-Type": "image/png"});
			response.write(file, "binary");
			response.end();
		}
	});
};
