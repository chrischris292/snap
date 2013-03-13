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
		},
		rickshaw: {
			deps: ['d3'],
			exports: 'Rickshaw'
		}
	},
	paths: {
		jquery: '../components/jquery/jquery',
		underscore: '../components/underscore/underscore',
		backbone: '../components/backbone/backbone',
		ace: '../components/ace/lib/ace',
		text: '../components/requirejs-text/text',
		d3: '../components/d3/d3',
		rickshaw: '../components/rickshaw/rickshaw'
	}
});

require(['views/app'], function (AppView) {
	/*jslint nonew:false*/
	// Initialize the application view
	new AppView();
});
