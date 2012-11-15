var sbml = require("./libsbmlWrapper");

var libsbml = sbml.libsbmlWrapper();

var filename = "00011-sbml-l2v4.xml";

//function printSbml(filename) {
var myDoc = libsbml.readSBML(filename),
    myDocInfo = {};
myDocInfo.level = libsbml.SBMLDocument_getLevel(myDoc);
myDocInfo.version = libsbml.SBMLDocument_getVersion(myDoc);

var myModel = libsbml.SBMLDocument_getModel(myDoc),
    myModelInfo = {};
myModelInfo.id = libsbml.Model_getId(myModel);

console.log(myDocInfo.level);
console.log(myModelInfo.id);

var mySpecies = libsbml.Model_getSpecies(myModel);
console.log(libsbml.Species_getInitialAmount(mySpecies.get(0)));

//	return myModelInfo.id;
//}

//exports.printSbml = printSbml;