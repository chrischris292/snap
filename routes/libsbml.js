/*global require console exports*/
var libsbml = require('libsbmljs').libsbml;

exports.methods = function(req, res) {
	'use strict';

	console.log('reached libsbml route')

	if (req.params.method) {
		var reader = libsbml.SBMLReader_create();
		var doc = libsbml.SBMLReader_readSBMLFromString(reader, req.body.sbml);
		var model = libsbml.SBMLDocument_getModel(doc);
		var writer = libsbml.SBMLWriter_create();
		var sbml = libsbml.SBMLWriter_writeSBMLToString(writer, doc);
		console.log('calling libsbml method ' + req.params.method);
		if (req.params.method === 'validate') {
			var numErrors = libsbml.SBMLDocument_getNumErrors(doc);
			var valid = false;
			if (numErrors === 0) {
				valid = true;
			}
			res.send({numErrors: numErrors, valid: valid, sbml: sbml});
		} else if (req.params.method === 'parameters') {
			var params = {};
			params.ids = [];
			params.values = [];
			var parameters = libsbml.Model_getListOfParameters(model);
			for (i = 0; i < libsbml.ListOf_size(parameters); i += 1) {
				var parameter = (libsbml.Model_getParameter(mod, i));
				params.ids.push(libsbml.Parameter_getId(parameter));
				params.values.push(libsbml.Parameter_getValue(parameter));
			}
			console.log(params);
			res.send(params);
		} else if (req.params.method === 'species') {
		} else {
			res.send('Sorry, ' + req.params.method + ' is not known.');
		}
	}
};
