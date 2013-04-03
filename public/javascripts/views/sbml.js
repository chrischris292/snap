/*global define document*/
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	'use strict';
	var SbmlView = Backbone.View.extend({
		template: _.template('<h2>Auto-Layout</h2><img src="<%= url %>" class="img-polaroid" />'),
		render: function() {
			var that = this;
			var sbml = this.model.get('sbml')
			$.ajax({
				data: {
					sbml: sbml
				},
				type: 'POST',
				processData: true,
				url: 'graphfab',
				success: function (data, textStatus, jqXHR) {
					console.log('Called GraphFab on Model');
					that.$el.html(that.template({
						url: '/show'
					}))
				}
			});
		}
	});
	return SbmlView;
});
