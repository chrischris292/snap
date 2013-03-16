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
			if (this.get('simulator') === 'libSbmlSim') {
				var n, i, species, headers, numSpecies, palette;
				palette = new Rickshaw.Color.Palette({ scheme: 'classic9' });
				headers = this.get('rawData')[0];
				numSpecies = this.get('rawData')[0].length - 1;
				this.set('data', []);
				for (n = 0; n < numSpecies; n += 1) {
					species = {};
					species.name = headers[n + 1];
					species.data = [];
					species.color = 'steelblue';
					for (i = 1; i < this.get('rawData').length; i += 1) {
						species.data.push({x: parseInt(this.get('rawData')[i][0], 10), y: parseInt(this.get('rawData')[i][n + 1], 10)});
					}
					this.get('data').push(species);
				}
			}
		}
	});
	return SimResultsModel;
});
