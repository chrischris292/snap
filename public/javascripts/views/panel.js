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
			this.render();
		},

		render: function () {
			if (this.model.get('visible')) {
				this.model.get('view').$el.show();
			} else {
				this.model.get('view').$el.hide();
			}

			this.model.get('view').$el.removeClass(this.model.previous('span'));
			this.model.get('view').$el.addClass(this.model.get('span'));

			this.model.get('view').render();
			//this.model.set('height', this.model.get('view').$el.height());
		}
	});

	return PanelView;
});
