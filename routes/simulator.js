/*global require console exports*/
exports.sim = function(req, res) {
	'use strict';

	var fs = require('fs'),
		exec = require('child_process').exec,
		csv = require('ya-csv'),
		r = require('librr').librr_c_api,
		command, options, out;

	if (req.body.sim.simulator === 'libsbmlsim') {
		command = 'mkdir -p tmp';
		exec(command);

		fs.writeFile('tmp/tmp.sbml', req.body.sbml, function(err) {
			if (err) {
				console.log(err);
			} else {
				console.log('SBML file saved in temporary location!');
				options = {
					cwd: 'tmp'
				};

				command = 'simulateSBML -t ' + req.body.sim.time + ' -s ' + req.body.sim.steps + ' -m 1 tmp.sbml';
				out = 'out.csv';
				exec(command, options, function(error, stdout, stderr) {
					if (error) {
						console.log('Error in executing child process: ' + error);
					} else if (stderr) {
						console.log('Error in simulation: ' + stderr);
					} else {
						console.log('Simulation Successful: ' + stdout);
						var data = [],
							reader;
						console.log('Reading simulated data');
						reader = csv.createCsvFileReader(options.cwd + '/' + out).on('data', function(row) {
							data.push(row);
						}).on('end', function() {
							console.log(data);
							res.send(data);
						});
					}
				});
			}
		});
	} else if (req.body.sim.simulator === 'rr') {
		console.log('Selected Road Runner');
		var rr = r.createRRInstance();
		r.loadSBML(rr, req.body.sbml);
		//var results = r.simulateEx(rr, 0, req.body.sim.time, req.body.sim.steps);
		var results = r.simulate(rr);
		var simData = r.resultToString(results).split('\n');
		simData.forEach(function(element, index, array) {
			array[index] = element.split('\t');
		});
		simData.pop();
		res.send(simData);
		//command = 'rr -m tmp.sbml -f -e ' + req.body.sim.time + ' -z ' + req.body.sim.steps;
		//out = 'rr_tmp.csv';
	}
};
