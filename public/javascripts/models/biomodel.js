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

			console.log();
			this.fetch({
				data: {
					id: modelId
				},
				type: 'GET',
				//error: function (jqXHR, textStatus, errorThrown) {
				//	console.log('Model failed to be fetched from server: ' + textStatus + errorThrown);
				//},
				processData: true,
				dataType: 'text',
				url: 'biomodels',
				success: function (data, textStatus, jqXHR) {
					modelSbml = textStatus;
					console.log('loaded ' + modelSbml);
				}
			});
		}
	});

	return BioModel;
});

