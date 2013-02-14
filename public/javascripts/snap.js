/*global Backbone ace*/

$(function() {
	//	var panel = Backbone.Model.extend({
	//		initialize: function() {
	//			this.el = $(document.createElement('div'));
	//			this.el.addClass('span'+this.width);
	//			ace.edit(this.el);
	//			$('.row-fluid#snap').append(this.el);
	//		}
	//	});
	//	
	//	var loadSbml = new panel({
	//		width: 9
	//	});
	var w = $('#loadSbmlWindow');
	w.fadeToggle();
	window.editor = ace.edit(w[0]);
	var e = window.editor;
//	e.setTheme('ace/themes/solarized_light');
//	e.getSession().setMode('ace/modes/xml');
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
		if (w.hasClass('span8')){
			w.switchClass('span8','span6');
		} else {
			w.switchClass('span6', 'span8');
		}
	});
	
});