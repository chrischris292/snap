/*global $:false state:false numeric:false SbmlParser*/

// simulation.js: functions for simulating models using numeric.js

function Sim() {
}

Sim.prototype.simulate = function($sbmlDoc) {
    var sbmlModel = new SbmlParser($sbmlDoc);
    var listOfSpecies = sbmlModel.listOfSpecies;
    // calculate stoichiometry matrix
    var stoichiometryMatrix = sbmlModel.stoichiometry;
    // finding infix        
    var listOfReactionInfix = sbmlModel.listOfReactionInfix;

    var f = function(t, x) {
        var odeString = '';

        var numSpecies = listOfSpecies.length;
        var count = 0;
        for (var prop in state.nodes) {
            if (state.nodes[prop].type == 'species') {
                count += 1;
                var speciesInd = listOfSpecies.indexOf(prop);
                for (var i = 0; i < listOfReactionInfix.length; i++) {
                    var stoich = stoichiometryMatrix[speciesInd][i];
                    odeString += stoich + ' * (' + listOfReactionInfix[i] + ')';
                    if (i < listOfReactionInfix.length - 1) {
                        odeString += ' + ';
                    }
                }
                if (count < numSpecies) {
                    odeString += ' , ';
                }
            }
        }

        return eval(odeString);

    };

    var initialConditions = [];
    for (var i = 0; i < listOfSpecies.length; i++) {
        initialConditions.push(parseFloat(state.nodes[listOfSpecies[i]].initialAmount));
    }

    //            var sol = numeric.dopri(0, 50, [.001, .002, .001], f, 1e-6, 2000);
    var sol = numeric.dopri(0, 50, initialConditions, f, 1e-6, 2000);

    var time = sol.x;
    var numSol = numeric.transpose(sol.y);
    // creating a simulation solution data structure
    var data = [];

    for (i = 0; i < time.length; i++) {
        var iter = {};
        iter.time = time[i];
        for (var j = 0; j < numSol.length; j++) {
            iter[listOfSpecies[j]] = numSol[j][i];
        }
        //            iter.value = sol.y[i];
        data.push(iter);
    }
    return data;
};