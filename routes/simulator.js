/*global require*/
exports.libsbmlsim = function (req, res) {
	'use strict';

	var sim = require('libsbmlsimjs').libsbmlsim,
		fs = require('fs');

	fs.writeFile('tmp/temp.sbml', req.body.sbml, function (err) {
		if (err) {
			console.log(err);
		} else {
			console.log('SBML file saved in temporary location!');

			fs.unlink('tmp/temp.sbml'); // delete temporary file
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
