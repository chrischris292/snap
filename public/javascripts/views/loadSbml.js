/*global define ace*/
define([
	'jquery',
	'underscore',
	'backbone'
],
	function($, _, Backbone) {
		'use strict';

		var LoadSbmlView = Backbone.View.extend({
			height: 800,
			width: 400,
			initialize: function () {
				$(this.el).height(this.height);
				$(this.el).width(this.width);
				ace.edit(this.el);
			}
		});
		return LoadSbmlView;
	});
