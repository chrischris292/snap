/*global $:false createButton:false SbmlParser:false Dialog:false d3:false state:false Graph ace*/

// builds dialog boxes

function Dialog(domLocation) {
    this.location = $(domLocation);
}

Dialog.prototype.createLoadSbml = function() {
    var $loadSbmlView = $(document.createElement('div')).attr({
        'id': 'loadSbml',
        'title': 'Load SBML'
    });

    var $helpText = $(document.createElement('p')).text('Input SBML Below:');
    $helpText.appendTo($loadSbmlView);


//    var $inputModelText = $(document.createElement('textarea')).attr('rows', 10).attr('cols', 30).attr('id', 'inputModel');
    
    var $inputModelText = $(document.createElement('div'));
    $inputModelText.height('200px');
    $inputModelText.width('400px');
    var editor = ace.edit($inputModelText[0]);
    editor.getSession().setMode("ace/mode/xml");

    
    
    
    $inputModelText.appendTo($loadSbmlView);
    // Adding line breaks
    for(var i = 0; i < 10; i++) {
        $(document.createElement('br')).appendTo($loadSbmlView);
    }
    var $button = $(document.createElement('button')).attr('id', 'loadModel').text('Import Model').appendTo($loadSbmlView);

    $(document.createElement('p')).text('OR enter SBML Test Case Model Number Below:').appendTo($loadSbmlView);

    var $caseInput = $(document.createElement('input')).attr('id', 'casenum');
    var $loadCaseNumberButton = $(document.createElement("button")).attr('id', 'loadCaseNumber').text('Load Case Number').click(function() {
        var caseNumber = $caseInput.val();
        var caseModel;
        while (caseNumber.toString().length < 5) {
            caseNumber = "0" + caseNumber;
        }
        $.get('../models/cases/semantic/' + caseNumber + '/' + caseNumber + '-sbml-l2v4.xml', function(model) {
            caseModel = (new XMLSerializer()).serializeToString(model);
            $inputModelText.val(caseModel);
            editor.setValue(caseModel);
        });
    });
    $caseInput.appendTo($loadSbmlView);
    $loadCaseNumberButton.appendTo($loadSbmlView);
    $loadSbmlView.dialog({
        width: 'auto'
    });
    return {
        $inputModelText: $inputModelText,
        $button: $button
    };
};

Dialog.prototype.createModelView = function($sbmlDoc) {
    var sbmlModel = new SbmlParser($sbmlDoc);

    var force;
    var links = [];
    var nodes = {};

    // generating nodes from listOfSpecies
    $sbmlDoc.find("species").each(function(n) {
        nodes[this.getAttribute('id')] = {
            name: this.getAttribute('id'),
            compartment: this.getAttribute('compartment'),
            initialAmount: this.getAttribute('initialAmount'),
            substanceUnits: this.getAttribute('substanceUnits'),
            type: 'species',
            visible: true,
            boundaryCondition: this.getAttribute('boundaryCondition') || false
        };
    });

    // creating nodes from reactions
    $sbmlDoc.find("reaction").each(function(n) {
        var reactionName = this.getAttribute('id');
        nodes[reactionName] = {
            name: reactionName,
            type: 'reaction',
            reversible: this.getAttribute('reversible') || false,
            fast: this.getAttribute('fast') || false,
            listOfReactants: $(this.getElementsByTagName('listOfReactants')).find('speciesReference'),
            listOfProducts: $(this.getElementsByTagName('listOfProducts')).find('speciesReference'),
            kineticLaw: this.getElementsByTagName('kineticLaw')[0]
        };

        // making links from reactants to reaction node
        var reactants = nodes[reactionName].listOfReactants;
        var products = nodes[reactionName].listOfProducts;
        //            if (reactants.length > 1 || products.length > 1) {
        for (var i = 0; i < reactants.length; i++) {
            var species = reactants[i].getAttribute('species');
            links.push({
                source: nodes[species],
                target: nodes[reactionName],
                type: 'fromReactants'
            });
        }
        // making links from reaction node to products
        for (var i = 0; i < products.length; i++) {
            var species = products[i].getAttribute('species');
            links.push({
                source: nodes[reactionName],
                target: nodes[species],
                type: 'toProducts'
            });
        }
        // make reaction node visible
        nodes[reactionName].visible = true;
        //            }
        //            else { // make direct connection if there is only one product and one reactant
        //                links.push({
        //                    source: nodes[reactants[0].getAttribute('species')],
        //                    target: nodes[products[0].getAttribute('species')],
        //                    type: 'toProducts'
        //                });
        //                // make node invisible
        //                nodes[reactionName].visible = false;
        //            }
    });

    // parsing SBML DOM for parameter info


    var w = 600,
        h = 400;

    force = d3.layout.force().nodes(d3.values(nodes)).links(links).size([w, h]).linkDistance(60).linkStrength(1).charge(-300).on("tick", tick).start();

    var modelView = $(document.createElement('div')).attr('id', 'modelView');
    modelView.appendTo('body');
    var svg = d3.select('div#modelView').append("svg:svg").attr("width", w).attr("height", h).attr("id", "modelGraph");
    // Making a border around SVG drawing area
    svg.append("svg:rect").attr("width", w).attr("height", h).attr("style", "fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,0,0)");

    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker").data(["toProducts", "licensing", "resolved"]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", - 1.5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");

    var path = svg.append("svg:g").selectAll("path").data(force.links()).enter().append("svg:path").attr("class", function(d) {
        return "link " + d.type;
    }).attr("marker-end", function(d) {
        return "url(#" + d.type + ")";
    });



    var circle = svg.append("svg:g").selectAll("circle").data(force.nodes()).enter().append("svg:circle").attr("r", function(d) {
        return getNodeSize(d);
    }).on("click", svgClick).call(force.drag); // Starts dragging //.call(force.drag);

    // adding titles to the nodes
    circle.append("title").text(function(d) {
        if (d.type == 'species') {
            var t = 'Initial Concentration: ';
            t += $sbmlDoc.find("listOfSpecies").find('#' + d.name).attr("initialAmount");

            return t;
        }
        else if (d.type == 'reaction') {
            return d.name;
        }
    });

    text = svg.append("svg:g").selectAll("g").data(force.nodes()).enter().append("svg:g");

    // A copy of the text with a thick white stroke for legibility.
    text.append("svg:text").attr("x", 8).attr("y", ".31em").attr("class", "shadow").text(function(d) {
        if (d.type == 'reaction') {
            return "";
        }
        else {
            return d.name;
        }
    });

    text.append("svg:text").attr("x", 8).attr("y", ".31em").text(function(d) {
        if (d.type == 'reaction') {
            return "";
        }
        else {
            return d.name;
        }
    });
    modelView.dialog({
        width: 'auto',
        title: 'Model View'
    });

    // Use elliptical arc path segments to doubly-encode directionality.
    function tick() {
        path.attr("d", function(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        });

        circle.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });

        text.attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
        });
    }

    // Open dialog box on click.
    function svgClick(d) {
        state.selectedNode = d;
        var parameters = sbmlModel.parameters;
        if (isReaction(d.name)) { // selected a reaction node
            (new Dialog('body')).createReactionForm(state.selectedNode);
//            $("#dialog-form-reaction").dialog("open");
//            $("#dialog-form-reaction").children("form").children("fieldset").children().remove();
//            $("#dialog-form-reaction").children("form").children("fieldset").append('<label for="id">ID</label><input type="text" name="id" id="selectedReactionId" class="reactionParam"/>');
//            $("input.reactionParam[name=id]").val(d.name);
//            $(d.kineticLaw).find("ci").each(function(index, item) {
//                var str = $.trim(item.textContent);
//                if (sbmlModel.parameters[str]) {
//                    var htmlStr = "<label for=" + str + ">" + str + "</label>" + '<input type="text" class=reactionParam name=' + str + " />" + '<div id=' + str + 'Slider></div>';
//                    $("#dialog-form-reaction").children("form").children("fieldset").append(htmlStr);
//                    $("input.reactionParam[name=" + str + "]").val(parameters[str]);
//                    $("div#" + str + "Slider").slider({
//                        min: sbmlModel.parameters[str] / 10,
//                        max: sbmlModel.parameters[str] * 10,
//                        slide: function(event, ui) {
//                            sbmlModel.updateParameter(str, $("div#" + str + "Slider").slider("option", "value"));
//                            $("input.reactionParam[name=" + str + "]").val(sbmlModel.parameters[str]);
//                            updateGraph();
//                        }
//                    });
//                    $("div#" + str + "Slider").slider('option', 'step', sbmlModel.parameters[str] / 10);
//                    $("div#" + str + "Slider").slider('option', 'value', sbmlModel.parameters[str]);
//                }
//            });
        }
        else { // selected a species node
            (new Dialog("body")).createSpeciesForm(state.selectedNode);
        }
    }

    // get node size from the name of the node
    function getNodeSize(node) {
        var NODESIZE = {
            reaction: 2,
            species: 8
        };
        if (node.type == 'reaction' && node.visible) { //is a reaction node
            return NODESIZE.reaction;
        }
        else if (node.visible) { // is a species node
            return NODESIZE.species;
        }
        else { // node should not be visible
            return 0;
        }
    }

    // return if name is a reactant or product aggregrate
    function isReaction(name) {
        if ($sbmlDoc.find("listOfReactions").find("#" + name).length > 0) {
            return true;
        }
        else {
            return false;
        }
    }

    // saving variables to state
    state.nodes = nodes;
    state.links = links;
    state.force = force;
    state.svg = svg;

};

Dialog.prototype.createSpeciesForm = function(d) {
    var $species = state.$sbmlDoc.find('species#' + d.name);

    var $speciesForm = $(document.createElement('div')).attr('title', 'Species Form');

    //ID
    $speciesForm.$speciesIdCaption = $(document.createElement('p')).text('ID');
    $speciesForm.append($speciesForm.$speciesIdCaption);
    $speciesForm.$speciesIdInput = $(document.createElement('input')).val($species.attr('id'));
    $speciesForm.append($speciesForm.$speciesIdInput);

    //Amount
    $speciesForm.$amountCaption = $(document.createElement('p')).text('Amount');
    $speciesForm.append($speciesForm.$amountCaption);
    $speciesForm.$amountInput = $(document.createElement('input')).val($species.attr('initialAmount'));
    $speciesForm.append($speciesForm.$amountInput);
    $speciesForm.$amountSlider = $(document.createElement('div'));
    $speciesForm.append($speciesForm.$amountSlider);

    $speciesForm.dialog({
        //autoOpen: false,
        open: function(event, ui) {
            var model = new SbmlParser(state.$sbmlDoc);
            $speciesForm.$amountSlider.slider({
                min: $species.attr('initialAmount') / 10,
                max: $species.attr('initialAmount') * 10,
                slide: function(event, ui) {
                    var sliderVal = $speciesForm.$amountSlider.slider('option', 'value');
                    $speciesForm.$amountInput.val(sliderVal);
                    // saving initial condition in model to state
                    model.updateSpecies($species.attr('id'), 'initialAmount', sliderVal);
                    state.$sbmlDoc = model.$sbmlDoc;
                    (new Dialog()).updateSimulationOutput(state.$plot, state.$sbmlDoc);
                    //                    selectedNode.initialAmount = selectedInitialAmount.val();
                    //                    sbmlModel.updateSpecies(selectedNode.name, "initialAmount", selectedInitialAmount.val());
                    //                    updateGraph();
                }
            });
            $speciesForm.$amountSlider.slider('option', 'step', $speciesForm.$amountInput.val() / 10);
            $speciesForm.$amountSlider.slider('option', 'value', parseFloat($speciesForm.$amountInput.val()));
        }
    });
};

Dialog.prototype.createReactionForm = function(d) {
    var model = new SbmlParser(state.$sbmlDoc);
    var $reaction = state.$sbmlDoc.find('reaction#' + d.name);

    var $reactionForm = $(document.createElement('div')).attr('title', 'Reaction Form');

    //ID
    $reactionForm.$speciesIdCaption = $(document.createElement('p')).text('ID');
    $reactionForm.append($reactionForm.$reactionIdCaption);
    $reactionForm.$reactionIdInput = $(document.createElement('input')).val($reaction.attr('id'));
    $reactionForm.append($reactionForm.$reactionIdInput);

    //Parameters
    $reaction.find('ci').each(function(index, item) {
        var name = $.trim(item.textContent);
        $reactionForm.$paramName = [];
        $reactionForm.$paramValue = [];
        $reactionForm.$paramSlider = [];
        if (model.parameters[name]) {
            $reactionForm.append($(document.createElement('p')).text('Parameter'));
            // add each parameter for the reaction in a jquery array
            $paramName = $(document.createElement('input')).val(name).appendTo($reactionForm);
            $paramValue = $(document.createElement('input')).val(model.parameters[name]).appendTo($reactionForm);
            $paramSlider = $(document.createElement('div')).appendTo($reactionForm);

            // storing elements into array within $reactionForm
            $reactionForm.$paramName.push($paramName);
            $reactionForm.$paramValue.push($paramValue);
            $reactionForm.$paramSlider.push($paramSlider);

            // setting up slider
            $paramSlider.slider({
                min: model.parameters[name] / 10,
                max: model.parameters[name] * 10,
                step: model.parameters[name] / 10,
                value: model.parameters[name],
                slide: function(event, ui) {
                    var sliderVal = $paramSlider.slider('option', 'value');
                    $paramValue.val(sliderVal);
                    // saving initial condition in model to state
                    model.updateParameter(name, sliderVal);
                    state.$sbmlDoc = model.$sbmlDoc;
                    (new Dialog()).updateSimulationOutput(state.$plot, state.$sbmlDoc);
                }
            });
        }
    });

    $reactionForm.dialog({
        width: 'auto'
    });
};

Dialog.prototype.createExportSbml = function() {
    var $exportSbml = $(document.createElement('div')).attr('title', 'Exported SBML').attr('height','400px').attr('width','600px');
    //$exportSbml.append($(document.createElement('textarea')).val((new XMLSerializer()).serializeToString(state.$sbmlDoc[0])).attr('rows', 30).attr('cols', 30));
    
    
    $exportSbml.text((new XMLSerializer()).serializeToString(state.$sbmlDoc[0]));
    
    
    var editor = ace.edit($exportSbml[0]);
    //editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/xml");
    
    state.exportedSbml = $(document.createElement('textarea')).val((new XMLSerializer()).serializeToString(state.$sbmlDoc));
    $exportSbml.dialog({
        width: '600px',
        height: 'auto',
        open: function( event, ui ) { editor.resize() },
        resize: function( event, ui ) { editor.resize() }
    });
};

Dialog.prototype.createSimulationOutput = function() {
    state.graph = new Graph();
    state.$plot = state.graph.simPlot(state.$sbmlDoc);
    var $simOutput = $(document.createElement('div')).attr('title', 'Simulation Output');
    $simOutput.append(state.$plot);
    $simOutput.dialog({
        width: 'auto'
    });
    return state.$plot;
};

Dialog.prototype.updateSimulationOutput = function($plot, $sbmlDoc) {
    state.graph.updateSimPlot($plot, $sbmlDoc);
};

Dialog.prototype.createViewSimOptions = function() {
    
}
