/*global define*/
define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	'use strict';

	var AceModel = Backbone.Model.extend({
		defaults: {
			height: 800,
			width: 400,
			theme: 'github',
			mode: 'xml'
		}
	});

	return AceModel;
});

