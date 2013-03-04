/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'models/Panel',
	'views/ace',
	'views/panel'
], function ($, _, Backbone, Panel, PanelView, AceView) {
	'use strict';

	var SnapView = Backbone.View.extend({

		initialize: function () {
			this.el = '#snap';
			this.$el = $(this.el);
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.$elLoadTestCase = this.$el.children().find('div#loadTestCase');
			this.loadSbmlView = new AceView({
				el: this.$elLoadSbml[0]
			});
			this.loadSbmlPanel = new Panel({
				view: this.loadSbmlView
			});
			//this.$el.append(this.loadSbmlView.el);
			//this.panels = new Panels([this.loadSbmlPanel]);
		}

		render: function () {
			this.
		}
	});

	return SnapView;
});
