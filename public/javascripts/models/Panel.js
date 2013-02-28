/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Panel = Backbone.Model.extend({
		defaults: {
			visible: false,
			span: 'span8'
		}
	});

	return Panel;
});
