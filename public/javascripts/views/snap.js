/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'models/Panel',
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
				model: new AceModel({theme: 'solarized_dark'})
			});
			this.loadSbmlPanel = new Panel({
				view: this.loadSbmlView,
				visible: true,
				span: 'span7'
			});
			this.loadSbmlPanelView = new PanelView({
				model: this.loadSbmlPanel
			});
			//this.$el.append(this.loadSbmlView.el);
			//this.panels = new Panels([this.loadSbmlPanel]);
		},

		render: function () {
		}
	});
	return SnapView;
});
