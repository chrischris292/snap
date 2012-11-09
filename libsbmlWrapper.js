var ffi = require("ffi");
var ref = require("ref");

function libsbmlWrapper() {
    var libsbml = ffi.Library('libsbml', {
        "readSBML": ["pointer", ["string"]],
        "SBMLDocument_getLevel": ["int", ["pointer"]],
        "SBMLDocument_getVersion": ["int", ["pointer"]],
        "SBMLDocument_getModel": ["pointer", ["pointer"]],
        "Model_getId": ["string", ["pointer"]],
        "Model_getNumFunctionDefinitions": ["int", ["pointer"]],
        "Model_getNumUnitDefinitions": ["int", ["pointer"]],
        "Model_getNumCompartmentTypes": ["int", ["pointer"]],
        "Model_getNumSpeciesTypes": ["int", ["pointer"]],
        "Model_getNumCompartments": ["int", ["pointer"]],
        "Model_getNumSpecies": ["int", ["pointer"]],
        "Model_getNumParameters": ["int", ["pointer"]],
        "Model_getNumInitialAssignments": ["int", ["pointer"]],
        "Model_getNumRules": ["int", ["pointer"]],
        "Model_getNumConstraints": ["int", ["pointer"]],
        "Model_getNumReactions": ["int", ["pointer"]],
        "Model_getNumEvents": ["int", ["pointer"]],
        "Model_getListOfSpecies": ["pointer", ["pointer"]],
        //"get": ["pointer", ["int"]],
        "Species_getInitialAmount": ["double", ["pointer"]]
    });
    return libsbml;
}

exports.libsbmlWrapper = libsbmlWrapper;
