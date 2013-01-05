/*global $:false d3:false numeric:false createButton:false SbmlParser:false Menu:false Dialog:false State:false*/
var state = new State(); //container for state variables of the gui
var dialogMaker;
init(); //initialize menu
function init() {
    state = {};
    dialogMaker = new Dialog("body"); //dialog maker
    mainMenu();
    //loadModelDialog(); // dialog to load sbml and opens viewModelDialog
}

function mainMenu() {
    var domLocation = "body";
    var menuStruct = [{
        "text": "File",
        "id": "file",
        "children": [{
            "id": "loadSbml",
            "text": "Load SBML"
        }, {
            "id": "exportSbml",
            "text": "Export SBML"
        }]
    }, {
        "id": "runModel",
        "text": "Simulate"
    }, {
        "id": "view",
        "text": "View",
        "children": [{
            "id": "viewSim",
            "text": "Simulation Options"
        }]
    }, {
        'id': 'clear',
        'text': 'Close All'
    }];
    var myMenu = new Menu(domLocation, menuStruct);
    $(myMenu.$menu, ".ui-menu").css('width', '200px');
    $("li#exportSbml").on("click", function (event, ui) {
        dialogMaker.createExportSbml();
    });
    $("li#runModel").on("click", function (event, ui) {
        dialogMaker.createSimulationOutput();
    });
    $('li#clear').on('click', function (event, ui) {
        var $old = $("body").children().remove();
        $old = $();
        init();
    });
    $("li#loadSbml").on("click", function (event, ui) {
        var output = dialogMaker.createLoadSbml();
        output.$button.click(function () {
            state.$sbmlDoc = $($.parseXML(output.$inputModelText.val())); //container for sbml document
            dialogMaker.createModelView(state.$sbmlDoc);
        });
    });
    $('li#viewSim').on('click', function (event, ui) {
        if (state.boolHasSim === true) {
            dialogMaker.createViewSimOptions();
        }
    });
}

function loadModelDialog() {
    // add click functionality
}
