/*global define*/
define([
	'underscore',
	'backbone'
], function(_, Backbone) {
	'use strict';

	var SimResultsModel = Backbone.Model.extend({
		defaults: {
			simulator: 'Not Set',
			rawData: 'Not Set',
			data: []
		},
		initialize: function () {
			this.parseData();
		},
		parseData: function () {
			if (this.simulator === 'libSbmlSim') {
				var n, i, species;
				this.headers = this.rawData[0];
				this.numSpecies = this.rawData[0].length - 1;
				this.data = [];
				for (n = 0; n < this.numSpecies; n += 1) {
					species = {};
					species.name = this.headers[n + 1];
					species.data = [];
					for (i = 1; i < this.rawData.length; i += 1) {
						species.data.push({x: this.rawData[i][0], y: this.rawData[i][n + 1]});
					}
				}
			}
		}
	});
	return SimResultsModel;
});
