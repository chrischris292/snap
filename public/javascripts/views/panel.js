/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
], function ($, _, Backbone) {
	'use strict';

	var PanelView = Backbone.View.extend({
		initialize: function () {
			this.listenTo(this.model, 'change:visible', this.render);
			this.listenTo(this.model, 'change:span', this.render);
		},

		render: function () {
			if (this.model.get('visible')) {
				this.view.$el.show();
			} else {
				this.view.$el.hide();
			}

			this.model.$el.removeClass(this.model.previous('span'));
			this.model$el.addClass(this.model.get('span'));
		}
	});

	return PanelView;
}
