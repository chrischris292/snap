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
					}
				}
			});

		}
	});

	return SBMLModel;
});

