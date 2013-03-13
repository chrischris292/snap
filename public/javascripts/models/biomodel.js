/*global define*/
define([
	'underscore',
	'backbone'
], function (_, Backbone) {
	'use strict';

	var Biomodel = Backbone.Model.extend({
		defaults: {
			sbml: 'was not fetched',
			id: 'was not assigned'
		},

		initialize: function () {
			var model = this;

			this.fetch({
				data: {
					id: model.id
				},
				type: 'GET',
				//error: function (jqXHR, textStatus, errorThrown) {
				//	console.log('Model failed to be fetched from server: ' + textStatus + errorThrown);
				//},
				processData: true,
				dataType: 'text',
				url: 'biomodels',
				success: function (data, textStatus, jqXHR) {
					model.set('sbml', textStatus);
					console.log('loaded model!');
				}
			});
		}
	});

	return Biomodel;
});

