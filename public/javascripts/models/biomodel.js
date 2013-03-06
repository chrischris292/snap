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

		initialize: function () {
			var modelId = this.id,
				modelSbml = this.sbml;
			this.fetch({
				data: {
					id: modelId
				},
				success: function (data, textStatus, jqXHR) {
					modelSbml = data;
					console.log('loaded ' + modelSbml);
				}
			});
		}
	});

	return BioModel;
});

