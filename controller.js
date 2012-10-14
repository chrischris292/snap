var NODESIZE = {
    reaction: 2,
    species: 8
};

var sbmlDoc;
var $sbmlDoc;
var text;
var circle;
var path;

var simpleModel;
var glycolysisModel;

$.get('./00011-sbml-l2v4.xml', function(data) {
    simpleModel = (new XMLSerializer()).serializeToString(data);
});

$.get('./Jana_WolfGlycolysis.xml', function(data) {
    glycolysisModel = (new XMLSerializer()).serializeToString(data);
});


$("textarea").val(simpleModel);

$("#helpText").hide();

$("button#btnLoadSimple").click(function() {
    $("textarea").val(simpleModel);
});

$("button#btnLoadGlycolysis").click(function() {
    $("textarea").val(glycolysisModel);
});


var links = [];
var nodes = {};

$("button#btnViewNetwork").click(function() {
    var str = $("textarea").val();
    $("p").hide("slow");
    $("textarea").hide("slow");
    $("button").hide("slow");
    $("#helpText").show("slow");


    sbmlDoc = $.parseXML(str);
    $sbmlDoc = $(sbmlDoc);
    
    
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
        if (reactants.length > 1 || products.length > 1) {
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
        }
        else { // make direct connection if there is only one product and one reactant
            links.push({
                source: nodes[reactants[0].getAttribute('species')],
                target: nodes[products[0].getAttribute('species')],
                type: 'toProducts'
            });
            // make node invisible
            nodes[reactionName].visible = false;
        }
    });
    
    // parsing SBML DOM for parameter info


    var w = window.innerWidth*.9,
        h = window.innerHeight*.7;

    var force = d3.layout.force().nodes(d3.values(nodes)).links(links).size([w, h]).linkDistance(60).linkStrength(1).charge(-300).on("tick", tick).start();

    var svg = d3.select("body").append("svg:svg").attr("width", w).attr("height", h);
    // Making a border around SVG drawing area
    svg.append("svg:rect").attr("width", w).attr("height", h).attr("style", "fill:rgb(255,255,255);stroke-width:1;stroke:rgb(0,0,0)");
    
    // Per-type markers, as they don't inherit styles.
    svg.append("svg:defs").selectAll("marker").data(["toProducts", "licensing", "resolved"]).enter().append("svg:marker").attr("id", String).attr("viewBox", "0 -5 10 10").attr("refX", 15).attr("refY", - 1.5).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("svg:path").attr("d", "M0,-5L10,0L0,5");

    path = svg.append("svg:g").selectAll("path").data(force.links()).enter().append("svg:path").attr("class", function(d) {
        return "link " + d.type;
    }).attr("marker-end", function(d) {
        return "url(#" + d.type + ")";
    });

    circle = svg.append("svg:g").selectAll("circle").data(force.nodes()).enter().append("svg:circle")
    //.attr("r", function(d) {return nodeSize[d.type]; })
    .attr("r", function(d) {
        return getNodeSize(d);
    }).on("click", click).call(force.drag);

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

});

$("#dialog-form").dialog({
    autoOpen: false,
    height: 300,
    width: 350,
    modal: true,
    buttons: {
        "Create an account": function() {
            var bValid = true;
            allFields.removeClass("ui-state-error");

            bValid = bValid && checkLength(name, "username", 3, 16);
            bValid = bValid && checkLength(email, "email", 6, 80);
            bValid = bValid && checkLength(password, "password", 5, 16);

            bValid = bValid && checkRegexp(name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter.");
            // From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
            bValid = bValid && checkRegexp(email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com");
            bValid = bValid && checkRegexp(password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9");

            if (bValid) {
                $("#users tbody").append("<tr>" + "<td>" + name.val() + "</td>" + "<td>" + email.val() + "</td>" + "<td>" + password.val() + "</td>" + "</tr>");
                $(this).dialog("close");
            }
        },
        Cancel: function() {
            $(this).dialog("close");
        }
    },
    close: function() {
        allFields.val("").removeClass("ui-state-error");
    }
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


// Open dialog box on click.
function click(d) {
    var title;
    if (isReaction(d.name)) {
        $('#reactionEquation').children().detach();
        title = 'Reaction Node';
//        $('#reactionEquation').append('<p>The equation for this reaction is:</p>');
//        var equation = $sbmlDoc.find("#" + d.name).find("math").clone()[0];
//        $('#reactionEquation').append(equation);
         $('#reactionEquation').append(printObject(d));

    } else {
        $('#reactionEquation').children().detach();
        title = 'Species Node';
//        $('#reactionEquation').attr('title', 'Species Node');
//        $('#reactionEquation').append('<p>The species node you selected is:</p>');
//        $('#reactionEquation').append('<p>' + d.name + '</p>');
//        $('#reactionEquation').append('<p></p>');
         $('#reactionEquation').append(printObject(d));
    }
    $('#reactionEquation').dialog({title: title});
}

// Returns string of properties within an object
function printObject(object) {
    var output = '';
    for (var property in object) {
        output += '<p>' + property + ': ' + object[property] + '; </p>';
    }
    return output;
}
