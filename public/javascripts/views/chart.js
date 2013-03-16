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
			this.legendElement = document.createElement('div');
			this.legendElement.setAttribute('id', 'legend');
			$(this.el).append(this.legendElement);
			this.graph = new Rickshaw.Graph({
				element: this.chartElement,
				series: this.model.get('data'),
				renderer: 'line'
			});

			this.graph.render();
			var hoverDetail = new Rickshaw.Graph.HoverDetail({
				graph: this.graph
			});

			var legend = new Rickshaw.Graph.Legend({
				graph: this.graph,
				element: this.legendElement
			});
			//$('#y_axis').css('position', 'relative').css('top', 0).css('bottom', 0).css('width', '40px');
			//$(this.el).css('position', 'relative')
			//this.x_axis = new Rickshaw.Graph.Axis.Time({ graph: this.graph });
			/*this.y_axis = new Rickshaw.Graph.Axis.Y({
				graph: this.graph,
				orientation: 'left',
				tickFormat: Rickshaw.Fixtures.Number.formatKMBT,
				element: this.yElement
			});*/

			this.render();
		},

		render: function () {
			this.graph.render();
		}
	});
	return ChartView;
});
