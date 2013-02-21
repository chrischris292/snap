/*global Backbone ace*/

var app = app || {};

$(function() {
	

	// Menu
	app.MenuItem = Backbone.Model.extend({

	});
	
	
	app.MenuList = Backbone.Collection.extend({
		model: app.MenuItem
	});
	
	app.menu = new app.MenuList([
		{id: 'loadSbml', pane:'loadSbmlWindow'},
		{id: 'importTestCase', pane: 'modal'},
		{id: 'run', pane: 'graph'},
		{id: 'view', pane: 'view'}
	]);
	
	
	app.PaneView = Backbone.View.extend({
		initialize: function(){
			this.el = $(document.createElement('div'))[0];
			this.$el.addClass('span'+this.model.get('width'));
			this.$el.addClass('test');
			$('.row-fluid#snap').append(this.$el);
			
			this.listenTo(this.model, 'change:visible', this.render);
		},
		render: function(){
			if (this.model.get('visible') === true) {
				this.$el.fadeIn();
			} else {
				this.$el.fadeOut();
			}
		}
	});
	
	app.Pane = Backbone.Model.extend({
		defaults: {
			visible: false
		}	
	});
	
	
	app.loadSbml = new app.Pane({
		name: 'Load SBML',
		width: 9
	});
	
	app.loadSbmlView = new app.PaneView({model: app.loadSbml});
	
	/*
	var w = $('#loadSbmlWindow');
	w.fadeToggle();
	window.editor = ace.edit(w[0]);
	var e = window.editor;
	e.setTheme('ace/themes/solarized_light');
	e.getSession().setMode('ace/modes/xml');
	$('.btn#loadSbml').click(function() {
		w.fadeToggle();
		e.resize();
		e.focus();
		w.height(600);
	});
	
	var t = $('#loadTestCaseWindow');
	t.fadeToggle();
	$('.btn#importTestCase').click(function(){
		t.fadeToggle();
		if (w.hasClass('span7')){
			w.switchClass('span7','span6');
		} else {
			w.switchClass('span6', 'span7');
		}
	});
	
	var c = $('#chartWindow');
	c.fadeToggle();
	$('.btn#run').click(function(){
		c.fadeToggle();
	})
	*/
	
});