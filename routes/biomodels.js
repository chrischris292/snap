/*global exports require*/
exports.getModel = function (req, res) {
	//res.header("Access-Control-Allow-Origin", "*");
	// Dependencies
	var biomodels = require('biomodels').BioModelsWSClient;
	// Get SBML From ID
	console.log('requested ID: ' + req.query.id)
	biomodels.getModelSBMLById(req.query.id, function (err, results) {
		console.log(err + results);
		res.send(results);
	});
};
