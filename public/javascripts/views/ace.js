/*global define ace*/
define([
	'jquery',
	'underscore',
	'backbone'
], function($, _, Backbone) {
		'use strict';

		var AceView = Backbone.View.extend({
			initialize: function () {
				this.editor = ace.edit(this.el);
				this.editor.setTheme("ace/theme/" + this.model.get('theme'));
				this.editor.getSession().setMode("ace/mode/" + this.model.get('mode'));
				this.render();
			},

			render: function () {
				$(this.el).height(this.model.get('height'));
				//$(this.el).width(this.model.get('width'));
				//$(this.el).width(this.model.view.$el.width());
				this.editor.resize();
			}
		});
		return AceView;
});
