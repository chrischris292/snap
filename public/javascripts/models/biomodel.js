/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var BioModel = Backbone.Model.extend({
		defaults: {
			sbml: 'was not fetched',
			id: 'was not assigned'
		},
	});

	return BioModel;
});

