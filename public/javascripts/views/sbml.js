/*global define document*/
define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
	'use strict';
	var SbmlView = Backbone.View.extend({
		template: _.template('<img src="<%= url %>" class="img-polaroid" />'),
		render: function() {
			var that = this;
			var sbml = this.model.get('sbml')
			if (this.model.get('valid')) {
				$.ajax({
					data: {
						sbml: sbml
					},
					type: 'POST',
					processData: true,
					url: 'graphfab',
					success: function (data, textStatus, jqXHR) {
						console.log('Called GraphFab on Model');
						that.$el.find('#layout').html(that.template({
							url: '/show'
						}))
					}
				});
			}
		}
	});
	return SbmlView;
});
