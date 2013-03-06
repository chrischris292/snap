/*global exports require*/
exports.getModel = function (req, res) {
	// Dependencies
	var biomodels = require('biomodels').BioModelsWSClient;
	// Get SBML From ID
	console.log(biomodels.getModelSBMLById(req.body.id, function (err, results) {
		console.log(err + results);
	}));
	res.send('done!');
};
