/*global define document*/
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	'use strict';
	var ParametersView = Backbone.View.extend({

		initialize: function() {
			this.render();
		}

		render: function() {
			var parameters = this.model.get('parameters');
			var i;
			for (i = 0; i < parameters.length; i += 1) {
				this.$el.append();
			}
		}
	});
	return ParametersView;
});
