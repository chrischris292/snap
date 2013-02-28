/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Panel = Backbone.model.extend({
		defaults: {visible: false}
	});

	return Panel;
});
