/*global define*/
define(['jquery', 'underscore', 'backbone', 'ace/ace'], function($, _, Backbone, ace) {
	'use strict';

	var LoadSbmlView = Backbone.View.extend({
		initialize: function () {
			ace.edit(this.el);
		}
	});
	return LoadSbmlView;
});
