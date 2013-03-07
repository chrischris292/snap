/*global exports require*/
exports.getModelIds = function (req, res) {
	// Dependencies
	var biomodels = require('biomodels').BioModelsWSClient;
	// Get SBML From ID
	console.log('requested chebi: ' + req.query.chebi)
	biomodels.getModelsIdByChEBI(req.query.chebi, function (err, results) {
		console.log(results);
		res.contentType('json')
		res.send({
			data: JSON.stringify({
				chebi: results
			})
		});
		res.send(200);
	});
};
