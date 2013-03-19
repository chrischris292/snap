/*global define document*/
define(['jquery-ui', 'underscore', 'backbone', 'd3', 'rickshaw'], function($, _, Backbone, d3, Rickshaw) {
	'use strict';
	var ChartView = Backbone.View.extend({
		initialize: function() {
			this.graph = new Rickshaw.Graph({
				element: this.$el.find('#chart')[0],
				series: this.model.get('data'),
				renderer: 'line'
			});

			this.graph.render();
			var hoverDetail = new Rickshaw.Graph.HoverDetail({
				graph: this.graph
			});

			var x_axis = new Rickshaw.Graph.Axis.Time({
				graph: this.graph
			});

			var legend = new Rickshaw.Graph.Legend({
				graph: this.graph,
				element: this.$el.find('#legend')[0]
			});

			var shelving = new Rickshaw.Graph.Behavior.Series.Toggle({
				graph: this.graph,
				legend: legend
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

		render: function() {
			this.graph.render();
		}
	});
	return ChartView;
});
