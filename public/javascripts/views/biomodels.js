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

		template: _.template('<button class="btn" id="<%= modelId %>"><%= modelId %></button>'),

		render: function () {
			this.$el.html(this.template({
				modelId: this.model.get('id')
			}));
			return this;
		},

		events: {
			'click': 'loadModel'
		},

		loadModel: function () {
			console.log('clicked model!');
			this.model.get('editorView').editor.setValue(this.model.get('sbml'));
		}
	});

	return BiomodelsView;
});
