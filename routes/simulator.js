/*global require*/
exports.libsbmlsim = function (req, res) {
	'use strict';

		var fs = require('fs'),
		exec = require('child_process').exec,
		csv = require('ya-csv')

	fs.writeFile('tmp/temp.sbml', req.body.sbml, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('SBML file saved in temporary location!');
			var command = 'simulateSBML -t 100 -s 100 -m 1 temp.sbml',
				options = {
					cwd: 'tmp'
				};
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
					reader = csv.createCsvFileReader('tmp/out.csv').on('data', function (row) {
						data.push(row);
					}).on('end', function () {
						console.log(data);
						res.send(data);
					});
				}
			});
		//	fs.unlink('tmp/temp.sbml'); // delete temporary file
		}
	});
};

exports.rr = function (req, res) {
	'use strict';

	var fs = require('fs'),
		exec = require('child_process').exec,
		csv = require('ya-csv'),
		command,
		options;

	command = 'mkdir -p tmp/rr';
	exec(command);

	fs.writeFile('tmp/rr/tmp.sbml', req.body.sbml, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('SBML saved for RR!');
			command = 'rr -m tmp.sbml -f -e 100 -z 1000';
			options = {
				cwd: 'tmp/rr'
			};
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
					reader = csv.createCsvFileReader('tmp/rr/rr_tmp.csv').on('data', function (row) {
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
