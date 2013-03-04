/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'collections/Panels',
	'views/ace'
], function ($, _, Backbone, Panels, AceView) {
	'use strict';

	var SnapView = Backbone.View.extend({

		initialize: function () {
			this.el = '#snap';
			this.$el = $(this.el);
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.$elLoadTestCase = this.$el.children().find('div#loadTestCase');
			this.panels = new Panels();
			this.loadSbmlView = new AceView({
				el: this.$elLoadSbml[0]
			});
			//this.$el.append(this.loadSbmlView.el);
		}

	});

	return SnapView;
});
