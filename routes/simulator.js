/*global require*/
exports.libsbmlsim = function (req, res) {
	'use strict';

	var sim = require('libsbmlsimjs').libsbmlsim,
		fs = require('fs'),
		exec = require('child_process').exec,
		csv = require('ya-csv'),
		simData;

	fs.writeFile('tmp/temp.sbml', req.body.sbml, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('SBML file saved in temporary location!');
			//var result = sim.simulateSBMLFromFile('tmp/temp.sbml', 100, 0.1, 10, 0, 1, 0);
			//sim.print_result(result);
			//sim.print_result(result);
			//var command = 'cd tmp && simulateSBML -t 100 -s 100 -m 1 temp.sbml',
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

	/*
	var exec = require('child_process').exec,
		fs = require('fs'),
		child,
		querystring = require('querystring'),
		url = require('url'),
		sbml; // request processing
	var command = "cd snap/server/sbml2matlab/install/ && ./sbml2matlab -input tmp.sbml";
	var options = {
		//cwd: 'server/sbml2matlab/install/',
		timeout: 10
	};
	console.log(command);

	fs.writeFile("./server/sbml2matlab/install/tmp.sbml", req.body.sbml, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log("The file was saved!");
		}
	});

	//	  child = exec(command, options, function (error, stdout, stderr) {
	child = exec(command, function(error, stdout, stderr) {

		//child = exec('pwd', function (error, stdout, stderr) {
		res.send(stdout + stderr);
		console.log('stdout: ' + stdout);
		console.log('stderr: ' + stderr);
		if (error !== null) {
			console.log('exec error: ' + error);
		}
	});
   */
};
