/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/Panels'
], function ($, _, Backbone, Panels) {
	'use strict';

	var SnapView = Backbone.View.extend({
		el: '#snap',

		initialize: function () {
			this.$elLoadSbml = this.$el.children('#loadSbml');
			this.$elLoadTestCase = this.$el.children('#loadTestCase');
			this.panels = new Panels();
		}
	});

	return SnapView;
});
