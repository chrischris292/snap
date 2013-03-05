/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var BioModel = Backbone.Model.extend({
		defaults: {
			this.sbml = 'was not fetched',
			this.id = 'was not assigned'
		}
	});

	return BioModel;
});

