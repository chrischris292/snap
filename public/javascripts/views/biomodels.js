/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
], function ($, _, Backbone) {
	'use strict';

	var BiomodelsView = Backbone.View.extend({

		initialize: function () {
			this.render();
		},

		template: _.template('<a href="biomodels"><%= modelId %></a>'),

		render: function () {
			this.$el.html(this.template({
				modelId: this.model.get('id')
			}));
		},

		events: {
			'click': 'loadModel'
		},

		loadModel: function () {

		}
	});

	return BiomodelsView;
});
