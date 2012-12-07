/*global $:false d3:false numeric:false createButton:false SbmlParser:false Menu:false Dialog:false*/

mainMenu();

var $sbmlDoc; //container for sbml document
var dialogMaker = new Dialog("body"); //dialog maker
loadModelDialog(); // dialog to load sbml and opens viewModelDialog

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
        "text": "Run Model"
    }];
    var myMenu = new Menu(domLocation, menuStruct);
    $(myMenu.$menu, ".ui-menu").css('width', '200px');
    
    $("li#exportSbml").on("click", function(event, ui) {
        alert("")
    });
    $("li#runModel").on("click", function(event, ui) {
        alert("")
    });
}

function loadModelDialog() {
// add click functionality
    $("li#loadSbml").on("click", function(event, ui) {
        var output = dialogMaker.createLoadSbml();
        output.$button.click(function() {
            $sbmlDoc = $($.parseXML(output.$inputModelText.val()));
            viewModelDialog();
        })
    });
}

function viewModelDialog() {
    dialogMaker.createModelView($sbmlDoc);
}