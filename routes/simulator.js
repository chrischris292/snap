/*global require console exports*/
exports.sim = function (req, res) {
	'use strict';

	var fs = require('fs'),
		exec = require('child_process').exec,
		csv = require('ya-csv'),
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

			if (req.body.sim.simulator === 'libsbmlsim') {
				command = 'simulateSBML -t ' + req.body.sim.time + ' -s ' + req.body.sim.steps + ' -m 1 tmp.sbml';
				out = 'out.csv';
			} else if (req.body.sim.simulator === 'rr') {
				command = 'rr -m tmp.sbml -f -e ' + req.body.sim.time + ' -z ' + req.body.sim.steps;
				out = 'rr_tmp.csv';
			}
			exec(command, options, function (error, stdout, stderr) {
				if (error) {
					console.log('Error in executing child process: ' + error);
				} else if (stderr) {
					console.log('Error in simulation: ' + stderr);
				} else {
					console.log('Simulation Successful: ' + stdout);
					var data = [],
					reader;
					console.log('Reading simulated data');
					reader = csv.createCsvFileReader(options.cwd + '/' + out).on('data', function (row) {
						data.push(row);
					}).on('end', function () {
						console.log(data);
						res.send(data);
					});
				}
			});
		}
	});
};
