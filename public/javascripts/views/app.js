/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'views/snap'
], function ($, _, Backbone, SnapView) {
	'use strict';

	var AppView = Backbone.View.extend({

		// Instead of generating a new element, bind to the existing skeleton of
		// the App already present in the HTML.
		el: '#application',

		// At initialization we bind to the relevant events on the `Todos`
		// collection, when items are added or changed. Kick things off by
		// loading any preexisting todos that might be saved in *localStorage*.
		initialize: function () {
			new SnapView();
		}
	});
	return AppView;
});
