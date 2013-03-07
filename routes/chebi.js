/*global exports require*/
exports.getModelIds = function (req, res) {
	// Dependencies
	var biomodels = require('biomodels').BioModelsWSClient;
	// Get SBML From ID
	console.log('requested chebi: ' + req.query.chebi)
	biomodels.getModelsIdByChEBI(req.query.chebi, function (err, results) {
		res.send(200);
		res.send(results);
	});
};
