/*global */

// state.js defines the state object that is used to keep track of the current state of `snap`

function State() {
    this.$sbmlDoc = null; // SBML document
    this.boolHasSim = false; // boolean indicating of simulation has been run
    this.selectedNode = null; // node selected from click on model view

    this.nodes = null; // d3 force directed nodes
    this.links = null; // d3 force directed linkages
    this.force = null; // d3 force directed graph
    this.svg = null; // svg element for building force directed graph

    this.graph = null; // Graph object
    this.$plot = null; // jquery element containing simulation plot element

}