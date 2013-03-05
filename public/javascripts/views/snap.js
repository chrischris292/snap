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
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.$elLoadTestCase = this.$el.children().find('div#loadTestCase');
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
		},
		events: {
			'click #loadSbml.btn' : 'toggleLoadSbml'
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
		render: function () {
		}
	});
	return SnapView;
});
