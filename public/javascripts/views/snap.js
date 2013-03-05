/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'models/panel',
	'models/ace',
	'views/ace',
	'views/panel'
], function ($, _, Backbone, Panel, AceModel, AceView, PanelView) {
	'use strict';

	var SnapView = Backbone.View.extend({

		initialize: function () {
			this.el = '#snap';
			this.$el = $(this.el);

			// Model
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.loadSbmlView = new AceView({
				el: this.$elLoadSbml[0],
				model: new AceModel({
					theme: 'solarized_dark'
				})
			});
			this.loadSbmlPanel = new Panel({
				view: this.loadSbmlView,
				visible: true,
				span: 'span12'
			});
			this.loadSbmlPanelView = new PanelView({
				model: this.loadSbmlPanel
			});

			this.$elImportModel = this.$el.children().find('div#importModel');

			// Simulation


			// Export
		},
		events: {
			'click #loadSbml.btn' : 'toggleLoadSbml',
			'click #importModel.btn' : 'toggleImportModel'
		},
		toggleVisible: function (p) {
			if (p.get('visible')) {
				p.set('visible', false);
			} else {
				p.set('visible', true);
			}
		},
		toggleLoadSbml: function () {
			this.toggleVisible(this.loadSbmlPanel);
		},
		toggleImportModel: function () {
			this.toggleVisible(this.importModelPanel);
		},
		render: function () {
		}
	});
	return SnapView;
});
