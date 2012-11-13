/*global $:false d3:false numeric:false createButton:false SbmlParser:false */

$(document).ready(function() {
    "use strict";
    var NODESIZE = {
        reaction: 2,
        species: 8
    }, sbmlDoc, $sbmlDoc, mySbmlParser, text, circle, path, simpleModel, glycolysisModel;

    var selectedNode;
    var svg;

    var listOfSpecies, parameters;

    $.get('./00011-sbml-l2v4.xml', function(data) {
        simpleModel = (new XMLSerializer()).serializeToString(data);
    });

    $.get('./Jana_WolfGlycolysis.xml', function(data) {
        glycolysisModel = (new XMLSerializer()).serializeToString(data);
    });

    $('div#accordion').accordion({
        collapsible: true
    });

    $("textarea").val(simpleModel);

    //$("#helpText").hide();

    $("button#btnLoadSimple").click(function() {
        $("textarea").val(simpleModel);
    });

    $("button#btnLoadGlycolysis").click(function() {
        $("textarea").val(glycolysisModel);
    });

    var force;
    var links = [];
    var nodes = {};

    $("button#btnViewNetwork").click(function() {
        console.log('clicked btnViewNetwork');
        var str = $("textarea").val();
        $('#accordion').accordion('activate', 1);
        //$("p").hide("slow");
        //$("textarea").hide("slow");
        //$(this).hide("slow").add($("button#btnLoadSimple")).add($("button#btnLoadGlycolysis")).hide("slow");

        //$("#helpText").show("slow");

        sbmlDoc = $.parseXML(str);
        $sbmlDoc = $(sbmlDoc);
        mySbmlParser = new SbmlParser($sbmlDoc);
        

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

        svg = d3.select("div#modelView").append("svg:svg").attr("width", w).attr("height", h).attr("id", "modelGraph");
        // Making a border around SVG drawing area
        svg.append("svg:rect").attr("width", w).attr("height", h).attr("style", "fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,0,0)");

        // Per-type markers, as they don't inherit styles.
        svg.append("svg:defs").selectAll("marker").data(["toProducts", "licensing", "resolved"]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", - 1.5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");

        path = svg.append("svg:g").selectAll("path").data(force.links()).enter().append("svg:path").attr("class", function(d) {
            return "link " + d.type;
        }).attr("marker-end", function(d) {
            return "url(#" + d.type + ")";
        });



        circle = svg.append("svg:g").selectAll("circle").data(force.nodes()).enter().append("svg:circle").attr("r", function(d) {
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
        
        createButton({
            buttonType: "lockDrag",
            domLocation: "div#modelView",
            clickFcn: circle,
            clickFcnParam: node_drag
        });
        createButton({
            buttonType: "unlockDrag",
            domLocation: "div#modelView",
            clickFcn: circle,
            clickFcnParam: force.drag
        });

        // Button to autolayout
        createButton({
            buttonType: "autoLayout",
            domLocation: "div#modelView"
        });

        // Button to turn off force
        createButton({
            buttonType: "forceSwitch",
            domLocation: "div#modelView"
        });

        // Button to run simulation
        createButton({
            buttonType: "simulate",
            domLocation: "div#modelView",
            clickFcn: printGraph,
        });

        printGraph();

    });

    var node_drag = d3.behavior.drag().on("dragstart", dragstart).on("drag", dragmove).on("dragend", dragend);

    function dragstart(d, i) {
        force.stop(); // stops the force auto positioning before you start dragging
    }

    function dragmove(d, i) {
        d.px += d3.event.dx;
        d.py += d3.event.dy;
        d.x += d3.event.dx;
        d.y += d3.event.dy;
        tick(); // this is the key to make it work together with updating both px,py,x,y on d !
    }

    function dragend(d, i) {
        d.fixed = true; // of course set the node to fixed so the force doesn't include the node in its auto positioning stuff
        tick();
        force.resume();
    }

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


    // get node size from the name of the node
    function getNodeSize(node) {
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

    var selectedId = $("#selectedId"),
        selectedCompartment = $("#selectedCompartment"),
        selectedInitialAmount = $("#selectedInitialAmount"),
        allFields = $([]).add(selectedId).add(selectedCompartment).add(selectedInitialAmount);


    $("#dialog-form-species").dialog({
        autoOpen: false,
        open: function(event, ui) {
            $('#initialAmountSlider').slider({
                min: selectedInitialAmount.val() / 10,
                max: selectedInitialAmount.val() * 10,
                slide: function(event, ui) {
                    selectedInitialAmount.val($('#initialAmountSlider').slider('option', 'value'));
                    selectedNode.initialAmount = selectedInitialAmount.val();
                    updateGraph();
                }
            });
            $('#initialAmountSlider').slider('option', 'step', selectedInitialAmount.val() / 10);
            $('#initialAmountSlider').slider('option', 'value', parseFloat(selectedInitialAmount.val()));
        },
        buttons: {
            Save: function() {
                links.forEach(function(link) {
                    if (link.target == selectedId.val()) {
                        link.target = selectedId.val();
                    }
                    if (link.source == selectedId.val()) {
                        link.source = selectedId.val();
                    }
                });

                selectedNode.name = selectedId.val();
                selectedNode.compartment = selectedCompartment.val();
                selectedNode.initialAmount = selectedInitialAmount.val();
                $(this).dialog("close");

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

            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });

    // Building reaction dialog form

    $("#dialog-form-reaction").dialog({
        autoOpen: false,
        open: function(event, ui) {
            $('#initialAmountSlider').slider({
                min: selectedInitialAmount.val() / 10,
                max: selectedInitialAmount.val() * 10,
                slide: function(event, ui) {
                    selectedInitialAmount.val($('#initialAmountSlider').slider('option', 'value'));
                    selectedNode.initialAmount = selectedInitialAmount.val();
                    updateGraph();
                }
            });
            $('#initialAmountSlider').slider('option', 'step', selectedInitialAmount.val() / 10);
            $('#initialAmountSlider').slider('option', 'value', parseFloat(selectedInitialAmount.val()));
        },
        buttons: {
            Save: function() {
                links.forEach(function(link) {
                    if (link.target == selectedId.val()) {
                        link.target = selectedId.val();
                    }
                    if (link.source == selectedId.val()) {
                        link.source = selectedId.val();
                    }
                });

                selectedNode.name = selectedId.val();
                selectedNode.compartment = selectedCompartment.val();
                selectedNode.initialAmount = selectedInitialAmount.val();
                $(this).dialog("close");

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

            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }
    });

    // Open dialog box on click.
    
    function svgClick(d) {
        selectedNode = d;
        var parameters = mySbmlParser.getParameters();
        if (isReaction(d.name)) { // selected a reaction node
            $("#dialog-form-reaction").dialog("open");
            $("#dialog-form-reaction").children("form").children("fieldset").children().remove();
            $("#dialog-form-reaction").children("form").children("fieldset").append('<label for="id">ID</label><input type="text" name="id" id="selectedReactionId" class="reactionParam"/>');
            $("input.reactionParam[name=id]").val(d.name);
            $(d.kineticLaw).find("ci").each(function(index, item) {
                var str = $.trim(item.textContent);
                if (parameters[str]) {
                    var htmlStr = "<label for=" + str + ">" + str + "</label>" + '<input type="text" class=reactionParam name=' + str + " />" + '<div id=' + str + 'Slider></div>';
                    $("#dialog-form-reaction").children("form").children("fieldset").append(htmlStr);
                    $("input.reactionParam[name=" + str + "]").val(parameters[str]);
                    $("div#" + str + "Slider").slider({
                        min: parameters[str] / 10,
                        max: parameters[str] * 10,
                        slide: function(event, ui) {
                            $("input.reactionParam[name=" + str + "]").val(parameters[str]);
                            updateGraph();
                        }
                    });
                    $("div#" + str + "Slider").slider('option', 'step', parameters[str] / 10);
                    $("div#" + str + "Slider").slider('option', 'value', parameters[str]);

                }
            });
        }
        else { // selected a species node
            $('#selectedId').val(d.name);
            $('#selectedCompartment').val(d.compartment);
            $('#selectedInitialAmount').val(d.initialAmount);
            if (d.boundaryCondition) {
                $('#selectedBoundaryCondition').attr('checked', 'checked');
            }
            else {
                $('#selectedBoundaryCondition').removeAttr('checked');
            }

            $("#dialog-form-species").dialog("open");

        }
    }

    function printGraph() {

        var parameters = mySbmlParser.getParameters();

        var listOfSpecies = mySbmlParser.getSpecies();
        // calculate stoichiometry matrix
        var stoichiometryMatrix = mySbmlParser.getStoichiometry();
        // finding infix        
        var listOfReactionInfix = mySbmlParser.getListOfReactionInfix({nodes: nodes});

        var f = function(t, x) {
            var odeString = '';

            var numSpecies = listOfSpecies.length;
            var count = 0;
            for (var prop in nodes) {
                if (nodes[prop].type == 'species') {
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
            initialConditions.push(parseFloat(nodes[listOfSpecies[i]].initialAmount));
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
            };
            //            iter.value = sol.y[i];
            data.push(iter);
        }



        var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);

        var y = d3.scale.linear().range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis().scale(x).orient("bottom");

        var yAxis = d3.svg.axis().scale(y).orient("left");

        var line = d3.svg.line().interpolate("basis").x(function(d) {
            return x(d.time);
        }).y(function(d) {
            return y(d.amount);
        });

        var svg = d3.select("div#simulationView").append("svg").attr("id", "simulation").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



        color.domain(d3.keys(data[0]).filter(function(key) {
            return key !== "time";
        }));


        var species = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {
                        time: d.time,
                        amount: +d[name]
                    };
                })
            };
        });

        x.domain(d3.extent(data, function(d) {
            return d.time;
        }));

        y.domain([
        d3.min(species, function(c) {
            return d3.min(c.values, function(v) {
                return v.amount;
            });
        }),
        d3.max(species, function(c) {
            return d3.max(c.values, function(v) {
                return v.amount;
            });
        })]);

        svg.append("g").attr("class", "x axis").attr("id", "xAxis").attr("transform", "translate(0," + height + ")").call(xAxis);

        svg.append("g").attr("class", "y axis").attr("id", "yAxis").call(yAxis).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", ".71em").style("text-anchor", "end").text("Amount");

        var specie = svg.selectAll(".specie").data(species).enter().append("g").attr("class", "specie");

        specie.append("path").attr("class", "line").attr("d", function(d) {
            return line(d.values);
        }).style("stroke", function(d) {
            return color(d.name);
        }).attr("id", "simLine");

        specie.append("text").datum(function(d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        }).attr("id", "simLabel").attr("transform", function(d) {
            return "translate(" + x(d.value.time) + "," + y(d.value.amount) + ")";
        }).attr("x", 3).attr("dy", ".35em").text(function(d) {
            return d.name;
        });
    }


    function updateGraph() {

        //console.log('inside simulate button')
        //$('p#helpText').hide('slow');



        //$('svg#modelGraph').hide('slow');
        //$(this).hide('slow');
        //$('button').hide('slow');



        // defines parameters
        parameters = {};
        for (var i = 0; i < $sbmlDoc.find('parameter').length; i++) { // from parameters
            parameters[$sbmlDoc.find('parameter')[i].getAttribute('id')] = $sbmlDoc.find('parameter')[i].getAttribute('value');
        }
        for (var i = 0; i < $sbmlDoc.find('compartment').length; i++) { // from compartments
            parameters[$sbmlDoc.find('compartment')[i].getAttribute('id')] = $sbmlDoc.find('compartment')[i].getAttribute('size');
        }


        // calculate stoichiometry matrix
        listOfSpecies = [];
        for (var i = 0; i < $sbmlDoc.find('species').length; i++) {
            listOfSpecies[i] = $sbmlDoc.find('species')[i].getAttribute('id');
        };

        for (var colRxn = []; colRxn.length < $sbmlDoc.find('reaction').length; colRxn.push(0));
        for (var stoichiometryMatrix = []; stoichiometryMatrix.length < listOfSpecies.length; stoichiometryMatrix.push(new Array(colRxn)));

        for (var i = 0; i < $sbmlDoc.find('reaction').length; i++) {
            var a = $sbmlDoc.find('reaction')[i];
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


        // finding infix

        var listOfReactionInfix = []
        for (var i = 0; i < $sbmlDoc.find('reaction').length; i++) {
            var a = $sbmlDoc.find('reaction')[i].getElementsByTagName('ci');

            var key = a[0].textContent.replace(/\s+/g, '');
            var token;
            if (parameters[key] != undefined) {
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
                if (parameters[key] != undefined) {
                    token = parameters[key];
                }
                else if (listOfSpecies.indexOf(key) > -1) {
                    token = 'x[' + listOfSpecies.indexOf(key) + ']'
                }
                else {
                    token = key;
                }
                infixString += '*' + token;
            }
            nodes[$sbmlDoc.find('reaction')[i].getAttribute('id')].infixString = infixString; // saves infix string to node

            listOfReactionInfix[i] = infixString;

        }


        var f = function(t, x) {
            var odeString = '';

            var numSpecies = listOfSpecies.length;
            var count = 0;
            for (var prop in nodes) {
                if (nodes[prop].type == 'species') {
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
            initialConditions.push(parseFloat(nodes[listOfSpecies[i]].initialAmount));
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
            };
            //            iter.value = sol.y[i];
            data.push(iter);
        }
        console.log(data[0])


        var margin = {
            top: 20,
            right: 80,
            bottom: 30,
            left: 50
        },
        width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);

        var y = d3.scale.linear().range([height, 0]);

        var color = d3.scale.category10();

        var xAxis = d3.svg.axis().scale(x).orient("bottom");

        var yAxis = d3.svg.axis().scale(y).orient("left");

        var line = d3.svg.line().interpolate("basis").x(function(d) {
            return x(d.time);
        }).y(function(d) {
            return y(d.amount);
        });

        var svg = d3.select("div#simulationView").select("svg#simulation");



        color.domain(d3.keys(data[0]).filter(function(key) {
            return key !== "time";
        }));


        var species = color.domain().map(function(name) {
            return {
                name: name,
                values: data.map(function(d) {
                    return {
                        time: d.time,
                        amount: +d[name]
                    };
                })
            };
        });

        x.domain(d3.extent(data, function(d) {
            return d.time;
        }));

        y.domain([
        d3.min(species, function(c) {
            return d3.min(c.values, function(v) {
                return v.amount;
            });
        }),
        d3.max(species, function(c) {
            return d3.max(c.values, function(v) {
                return v.amount;
            });
        })]);

        console.log(data[data.length - 1]);

        svg.select(".x.axis").call(xAxis);

        svg.select(".y.axis").call(yAxis);

        svg.selectAll("path#simLine").data(species).attr("d", function(d) {
            return line(d.values);
        });

        svg.selectAll("text#simLabel").data(species).datum(function(d) {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        }).attr("transform", function(d) {
            return "translate(" + x(d.value.time) + "," + y(d.value.amount) + ")";
        }).text(function(d) {
            return d.name;
        });

        //  var specie = svg.selectAll(".specie")
        //  .data(species)
        //    .selectAll("path")
        //      .attr("class", "line")
        //      .attr("d", function(d) { return line(d.values); })
        //      .style("stroke", function(d) { return color(d.name); });

        //  specie.selectAll("text")
        //      .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
        //      .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.amount) + ")"; })
        //      .attr("x", 3)
        //      .attr("dy", ".35em")
        //      .text(function(d) { return d.name; });
    }




});
