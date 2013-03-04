/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/Panels',
	'views/loadSbml'
], function ($, _, Backbone, Panels, LoadSbmlView) {
	'use strict';

	var SnapView = Backbone.View.extend({

		initialize: function () {
			this.el = '#snap';
			this.$el = $(this.el);
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.$elLoadTestCase = this.$el.children().find('div#loadTestCase');
			this.panels = new Panels();
			this.loadSbmlView = new LoadSbmlView();
		}

	});

	return SnapView;
});
