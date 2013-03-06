/*global define*/
define([
	'jquery',
	'underscore',
	'backbone',
	'models/panel',
	'models/ace',
	'views/ace',
	'views/panel',
	'views/biomodels',
	'models/biomodel',
	'text!templates/biomodels.html',
	'collections/biomodels'
], function ($, _, Backbone, Panel, AceModel, AceView, PanelView, BiomodelsView, Biomodel, ImportModelHtml, BiomodelsCollection) {
	'use strict';

	var SnapView = Backbone.View.extend({

		initialize: function () {
			this.el = '#snap';
			this.$el = $(this.el);

			// Model
			this.$elLoadSbml = this.$el.children().find('div#loadSbml');
			this.loadSbmlView = new AceView({
				el: this.$elLoadSbml[0],
				model: new AceModel({
					theme: 'solarized_dark'
				})
			});
			this.loadSbmlPanel = new Panel({
				view: this.loadSbmlView,
				visible: true,
				span: 'span9'
			});
			this.loadSbmlPanelView = new PanelView({
				model: this.loadSbmlPanel
			});

			this.$elImportModel = this.$el.children().find('div#importModel');
			var template = _.template(ImportModelHtml);
			this.$elImportModel.append(template());
			var $elImportModel = this.$elImportModel;
			this.importModelPanel = new Panel({
				view: new Backbone.View({
					el: $elImportModel[0]
				}),
				span: 'span2'
			});
			this.importModelPanelView = new PanelView({
				model: this.importModelPanel
			});

			this.BiomodelsCollection = new BiomodelsCollection();
			this.BiomodelsCollection.add({id: 'BIOMD0000000001'});
			//this.BiomodelsView = new BiomodelsView(new Biomodel({id: 'BIOMD0000000001'}));

			// Simulation


			// Export

			this.render();
		},
		events: {
			'click #loadSbml.btn' : 'toggleLoadSbml',
			'click #importModel.btn' : 'toggleImportModel'
		},
		toggleVisible: function (p) {
			if (p.get('visible')) {
				p.set('visible', false);
			} else {
				p.set('visible', true);
			}
		},
		toggleLoadSbml: function () {
			this.toggleVisible(this.loadSbmlPanel);
		},
		toggleImportModel: function () {
			this.toggleVisible(this.importModelPanel);
		},
		render: function () {
		}
	});
	return SnapView;
});
