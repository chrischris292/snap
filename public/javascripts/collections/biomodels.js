/*global define*/
define([
	'underscore',
	'backbone',
	'models/biomodel'
], function (_, Backbone, Biomodel) {
	'use strict';

	var BiomodelsCollection = Backbone.Collection.extend({
		url: '/biomodels',

		model: Biomodel

	});
});

