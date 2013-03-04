/*global define*/
define(['jquery', 'underscore', 'backbone', 'ace/ace'], function($, _, Backbone, ace) {
	'use strict';

	var LoadSbmlView = Backbone.View.extend({
		tagName: 'div',

		initialize: function() {
			ace.edit(this.el);
		}
	});
	return LoadSbmlView;
});
