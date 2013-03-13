/*global define document*/
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
			this.yElement = document.createElement('div');
			this.yElement.setAttribute('id', 'y_axis');
			$(this.el).append(this.yElement);
			this.chartElement = document.createElement('div');
			this.chartElement.setAttribute('id', 'chart_container');
			$(this.el).append(this.chartElement);
			this.graph = new Rickshaw.Graph({
				element: this.chartElement,
				series: [{
					color: 'steelblue',
					data: [
						{ x: 0, y: 40 },
						{ x: 1, y: 49 },
						{ x: 2, y: 38 },
						{ x: 3, y: 30 },
						{ x: 4, y: 32 } ]
				}],
				width: 100,
				height: 100
		});

			//$('#y_axis').css('position', 'relative').css('top', 0).css('bottom', 0).css('width', '40px');
			//$(this.el).css('position', 'relative')
			//this.x_axis = new Rickshaw.Graph.Axis.Time({ graph: this.graph });
			this.y_axis = new Rickshaw.Graph.Axis.Y({
				graph: this.graph,
				orientation: 'left',
				tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
				element: this.yElement
			});

			this.render();
		},

		render: function () {
			this.graph.render();
		}
	});
	return ChartView;
});
