// sbml.js: Parsing sbml documents

function SbmlParser($sbmlDoc) {
    this.$sbmlDoc = $sbmlDoc;
}

// finds parameters and compartments in model
SbmlParser.prototype.getParameters = function() {
    var parameters = {};
    for (var i = 0; i < this.$sbmlDoc.find('parameter').length; i++) { // from parameters
        parameters[this.$sbmlDoc.find('parameter')[i].getAttribute('id')] = this.$sbmlDoc.find('parameter')[i].getAttribute('value');
    }
    for (i = 0; i < this.$sbmlDoc.find('compartment').length; i++) { // from compartments
        parameters[this.$sbmlDoc.find('compartment')[i].getAttribute('id')] = this.$sbmlDoc.find('compartment')[i].getAttribute('size');
    }
    return parameters;
};

// returns list of species in model
SbmlParser.prototype.getSpecies = function() {
    var listOfSpecies = [];
    for (var i = 0; i < this.$sbmlDoc.find('species').length; i++) {
        listOfSpecies[i] = this.$sbmlDoc.find('species')[i].getAttribute('id');
    };
    return listOfSpecies;
}

// returns stoichiometry matrix
SbmlParser.prototype.getStoichiometry = function() {
    var listOfSpecies = this.getSpecies();
    for (var colRxn = []; colRxn.length < this.$sbmlDoc.find('reaction').length; colRxn.push(0));
    for (var stoichiometryMatrix = []; stoichiometryMatrix.length < listOfSpecies.length; stoichiometryMatrix.push(new Array(colRxn)));

    for (var i = 0; i < this.$sbmlDoc.find('reaction').length; i++) {
        var a = this.$sbmlDoc.find('reaction')[i];
        var listOfProducts = $(a).find('listOfProducts').find('speciesReference');
        for (var j = 0; j < listOfProducts.length; j++) {
            var ind = listOfSpecies.indexOf(listOfProducts[j].getAttribute('species'));
            stoichiometryMatrix[ind][i] = 1;
        }
        var listOfReactants = $(a).find('listOfReactants').find('speciesReference')
        for (var j = 0; j < listOfReactants.length; j++) {
            var ind = listOfSpecies.indexOf(listOfReactants[j].getAttribute('species'));
            stoichiometryMatrix[ind][i] = -1;
        }
    }
    return stoichiometryMatrix;
}

// returns list of infix strings for reactions
SbmlParser.prototype.getListOfReactionInfix = function(input) {
    var parameters = this.getParameters();
    var listOfSpecies = this.getSpecies();
    var listOfReactionInfix = [];
    for (var i = 0; i < this.$sbmlDoc.find('reaction').length; i++) {
        var a = this.$sbmlDoc.find('reaction')[i].getElementsByTagName('ci');

        var key = a[0].textContent.replace(/\s+/g, '');
        var token;
        if (parameters[key] !== undefined) {
            token = parameters[key];
        }
        else if (listOfSpecies.indexOf(key) > -1) {
            token = 'x[' + listOfSpecies.indexOf(key) + ']'
        }
        else {
            token = key;
        }

        var infixString = token;
        for (var j = 1; j < a.length; j++) {
            key = a[j].textContent.replace(/\s+/g, '');
            if (parameters[key] !== undefined) {
                token = parameters[key];
            }
            else if (listOfSpecies.indexOf(key) > -1) {
                token = 'x[' + listOfSpecies.indexOf(key) + ']';
            }
            else {
                token = key;
            }
            infixString += '*' + token;
        }
        
        // optionally appends infix strings to nodes
        input.nodes[this.$sbmlDoc.find('reaction')[i].getAttribute('id')].infixString = infixString; // saves infix string to node

        listOfReactionInfix[i] = infixString;
    }
    return listOfReactionInfix;
}