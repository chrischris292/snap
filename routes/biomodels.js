/*global exports require*/
exports.getModel = function (req, res) {
	// Dependencies
	var biomodels = require('biomodels').BioModelsWSClient;
	// Get SBML From ID
	console.log('requested ID: ' + req.query.id)
	console.log(biomodels.getModelSBMLById(req.query.id, function (err, results) {
		console.log(err + results);
		res.send(err + results);
	}));
};
