/*global define*/
define([
	'jquery',
	'underscore',
	'backbone'
], function ($, Backbone) {
	'use strict';

	var SnapView = Backbone.View.extend({
		el: '#snap',

		initialize: function () {
			this.$elLoadSbml = this.$el.children('#loadSbml');
			this.$elLoadTestCase = this.$el.children('#loadTestCase');
		}
	});

	return SnapView;
});
