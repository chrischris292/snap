/*global require */
'use strict';

// Require.js allows us to configure shortcut alias
require.config({
	// The shim config allows us to configure dependencies for
	// scripts that do not call define() to register a module
	shim: {
		underscore: {
			exports: '_'
		},
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone'
		}
	},
	paths: {
		jquery: '../components/jquery/jquery.js',
		underscore: '../components/underscore/underscore.js',
		backbone: '../components/backbone/backbone.js'
	}
});

require(['views/app'], function (AppView) {
	/*jslint nonew:false*/
	// Initialize the application view
	new AppView();
});
