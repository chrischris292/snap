/*global define ace*/
define([
	'jquery',
	'underscore',
	'backbone'
],
	function($, _, Backbone) {
		'use strict';

		var AceView = Backbone.View.extend({
			height: 800,
			width: 400,
			theme: 'github',
			mode: 'xml',
			initialize: function () {
				$(this.el).height(this.height);
				$(this.el).width(this.width);
				this.editor = ace.edit(this.el);
				this.editor.setTheme("ace/theme/" + this.theme);
				this.editor.getSession().setMode("ace/mode/" + this.mode);
				this.editor.resize();
			}
		});
		return AceView;
	});
