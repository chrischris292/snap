/*global define require*/
var ace = require(['../components/ace/lib/ace'])
define(['jquery', 'underscore', 'backbone', 'require'], function($, _, Backbone, require) {
	'use strict';

	var LoadSbmlView = Backbone.View.extend({
		tagName: 'div',

		initialize: function() {
			ace.edit(this.el);
		}
	});
	return LoadSbmlView;
});
