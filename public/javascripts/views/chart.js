/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'd3',
	'rickshaw'
], function($, _, Backbone, d3, Rickshaw) {
	'use strict';
	var ChartView = Backbone.View.extend({
		initialize: function () {
			this.graph = new Rickshaw.Graph({
				element: this.el,
				series: [{
					color: 'steelblue',
					data: [
						{ x: 0, y: 40 },
						{ x: 1, y: 49 },
						{ x: 2, y: 38 },
						{ x: 3, y: 30 },
						{ x: 4, y: 32 } ]
				}]
			});

			this.render();
		},

		render: function () {
			this.graph.render();
		}
	});
	return ChartView;
});
