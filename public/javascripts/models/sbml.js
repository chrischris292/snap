/*global define*/
define([
	'jquery',
	'underscore',
	'backbone'
], function ($, _, Backbone) {
	'use strict';

	var SBMLModel = Backbone.Model.extend({

		validate: function (attributes, options) {
			$.ajax({
				data: {
					sbml: attributes.sbml
				},
				type: 'POST',
				processData: true,
				url: 'libsbml/validate',
				success: function (data, textStatus, jqXHR) {
					console.log('Called libSBML Validate');
					if (data === 'false') {
						attributes.valid = false;
						console.log('SBML is not valid');
					}
				}
			});

		}
	});

	return SBMLModel;
});

