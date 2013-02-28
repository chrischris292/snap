/*global define*/
define([
	'underscore',
	'backbone',
	'models/Panel'
], function (_, Backbone, Panel) {
	'use strict';

	var PanelCollection = Backbone.Collection.extend({
		model: Panel
	});

	return PanelCollection;

});
