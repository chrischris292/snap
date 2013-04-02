/*global require console exports*/
exports.graphfab = function (req, res) {
	'use strict';

	var fs = require('fs'),
		exec = require('child_process').exec,
		command,
		options,
		out;

	command = 'mkdir -p tmp';
	exec(command);

	fs.writeFile('tmp/tmp.sbml', req.body.sbml, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('SBML file saved in temporary location!');
			options = {
				cwd: 'tmp'
			};

			console.log('Beginning GraphFab algorithm')

			command = 'graphfab tmp.sbml'
			exec(command, options, function (error, stdout, stderr) {
				if (error) {
					console.log('Error in executing child process: ' + error);
				} else if (stderr) {
					console.log('Error in GraphFab: ' + stderr);
				} else {
					console.log('GraphFab Ran Successfully: ' + stdout);
					res.send(200);
				}
			});
		}
	});
};
