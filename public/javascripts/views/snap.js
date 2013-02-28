/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/Panels'
], function ($, _, Backbone, Panels) {
	'use strict';

	var SnapView = Backbone.View.extend({

		initialize: function () {
			this.el = '#snap';
			this.$el = $(this.el);
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.$elLoadTestCase = this.$el.children().find('div#loadTestCase');
			this.panels = new Panels();
		}
	});

	return SnapView;
});
