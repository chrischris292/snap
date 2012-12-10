// functions for creating buttons
// requires $ be defined
// requires nodes, force

/*global $:false */

// button

function createButton(input) {
    
    var nodes = window.nodes;
    var force = window.force;
    
    switch (input.buttonType) {
    
    case "lockDrag":
        $(input.domLocation).append('<br/><button type="button" id=btnLockDrag>Lock Dragged Nodes</button>');
        $('button#btnLockDrag').click(function() {
            input.clickFcn.call(input.clickFcnParam);
        });
        break;
    
    case "unlockDrag":
        $(input.domLocation).append('<br/><button type="button" id=btnUnlockDrag>Unlock Dragged Nodes</button>');
        $('button#btnUnlockDrag').click(function() {
            input.clickFcn.call(input.clickFcnParam);
        });
        break;
    
    case "autoLayout":
        $(input.domLocation).append('<br/><button type="button" id=btnAutoLayout>Auto-Layout</button>');
        $('button#btnAutoLayout').click(function() {
            for (var prop in nodes) {
                nodes[prop].fixed = false;
                force.resume();
            }
            console.log('inside auto-layout button');
        });
        break;
        
    case "forceSwitch":
        $(input.domLocation).append('<br/><button type="button" id=btnForce>Turn Off Auto-Layout</button>');
        $('button#btnForce').click(function() {
            for (var prop in nodes) {
                nodes[prop].fixed = true;
                force.resume();
            }
            console.log('inside force button');
        });
        break;
        
    case "simulate":
        $(input.domLocation).append('<br/><button type="button" id=btnSimulate>Simulate</button>')
        $('button#btnSimulate').click(function() {
            input.clickFcn();
        });
        break;
        
    case "exportSbml":
        $(input.domLocation).append('<br/><button type="button" id=btnExportSbml>Export SBML</button>')
        $('button#btnExportSbml').click(function() {
            input.clickFcn();
        });
        break;
        
    default:
        console.log("Undefined buttonType")
        alert("Undefined buttonType used!")
    }
}