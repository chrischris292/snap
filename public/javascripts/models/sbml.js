/*global define*/
define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	'use strict';

	var SBMLModel = Backbone.Model.extend({

		url: 'libsbml/validate',
		validate: function (attributes, options) {
			var that = this;
			$.ajax({
				data: {
					sbml: attributes.sbml
				},
				url: 'libsbml/validate',
				type: 'POST',
				success: function (data, textStatus, jqXHR) {
					console.log('Called libSBML Validate');
					if (data.valid === true) {
						attributes.valid = true;
						console.log('SBML is valid');
					} else {
						attributes.valid = false;
						console.log('SBML is NOT valid');
						return false;
					}
				}
			});
		},
		updateParameters: function () {
			var model = this;
			this.save({
				data: {sbml: model.get('sbml')},
				url: 'libsbml/parameters',
				success: function (data, textStatus, jqXHR) {
					var parameters = model.get('parameters') || {};
					parameters.ids = data.ids;
					parameters.values = data.values;
					model.set('parameters', parameters);
				}
			});
		}
	});

	return SBMLModel;
});

