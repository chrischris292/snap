var sbml = require("./libsbmlWrapper");

var libsbml = sbml.libsbmlWrapper();

// var filename = "00011-sbml-l2v4.xml";

function printSbml(filename) {
	var myDoc = libsbml.readSBML(filename), myDocInfo = {};
	myDocInfo.level = libsbml.SBMLDocument_getLevel(myDoc);
	myDocInfo.version = libsbml.SBMLDocument_getVersion(myDoc);
	
	var myModel = libsbml.SBMLDocument_getModel(myDoc), myModelInfo = {};
	myModelInfo.id = libsbml.Model_getId(myModel);
	myModelInfo.functionDefinitions = libsbml.Model_getNumFunctionDefinitions(myModel);
	
	var m = myModel;
	
	//console.log(myDocInfo.level);
	//console.log(myModelInfo.id);
	
	//return myModelInfo.id;
	
	var modelInfo = "<html>" +
	'<head>'+
    '<meta http-equiv="Content-Type" content="text/html; '+
    'charset=UTF-8" />'+
    '</head>'+
    '<body>'+
    "<p>" + 'model id: : ' +  libsbml.Model_getId(m) +
    "</p>" +
    "<p>" + 'functionDefinitions: ' +  libsbml.Model_getNumFunctionDefinitions(m) +
    "</p>" +
    "<p>" + 'unitDefinitions: ' +  libsbml.Model_getNumUnitDefinitions(m) +
    "</p>" +
    "<p>" + 'compartmentTypes: ' +  libsbml.Model_getNumCompartmentTypes(m) +
    "</p>" +
    "<p>" + 'specieTypes: ' +  libsbml.Model_getNumSpeciesTypes(m) +
    "</p>" +
    "<p>" + 'compartments: ' +  libsbml.Model_getNumCompartments(m) +
    "</p>" +
    "<p>" + 'species: ' +  libsbml.Model_getNumSpecies(m) +
    "</p>" +
    "<p>" + 'parameters: ' +  libsbml.Model_getNumParameters(m) +
    "</p>" +
	"</body>" +
	"</html>";
	console.log("modelInfo is "+modelInfo);
	return modelInfo;
}

exports.printSbml = printSbml;
