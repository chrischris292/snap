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

			// BioModels
			//this.listenTo(BiomodelsCollection, 'add', this.addModel);
			this.biomodels = new BiomodelsCollection();
			this.listenTo(this.biomodels, 'sync', this.addModelView);
			//this.biomodels.fetch();

			// Simulation


			// Export

			this.render();
		},
		events: {
			'click #loadSbml.btn' : 'toggleLoadSbml',
			'click #importModel.btn' : 'toggleImportModel',
			'click #searchBiomodels.btn' : 'getBiomodels'
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
		// gets new biomodel attributes
		newAttributes: function (id, view) {
			return {
				id: id,
				editorView: view
			};
		},
		// generates a list of all biomodels that match search criteria and
		// then adds all the models to the collection
		getBiomodels: function () {
			// searching by model ID
			var mId = this.$elImportModel.children().find('input#modelId')[0].value;

			//this.biomodels.create(this.newAttributes(mId, this.loadSbmlView));
			//this.biomodels.add(new Biomodel({id: mId, editorView: this.loadSbmlView}));

			this.biomodel = new Biomodel({id: mId, editorView: this.loadSbmlView});
			this.biomodelView = new BiomodelsView({model: this.biomodel});
			this.listenTo(this.biomodel, 'change:sbml', this.addBiomodelView);
			// searching by ChEBI ID
			var chebi = this.$elImportModel.children().find('input#chebi')[0].value;
			$.ajax({
				data: {
					chebi: chebi
				},
				type: 'GET',
				//error: function (jqXHR, textStatus, errorThrown) {
				//	console.log('Model failed to be fetched from server: ' + textStatus + errorThrown);
				//},
				dataType: 'json',
				url: 'chebi',
				success: function (data, textStatus, jqXHR) {
					console.log(JSON.parse(data));
				},
				error: function (jqXHR, textStatus, errorThrown) {
					console.log(textStatus);
				}
			});
		},
		// adds a single biomodel to the collection and creates the view
		addModel: function (biomodel) {
			var view = new BiomodelsView({model: biomodel});
		},
		addModelView: function (biomodel) {
			var view = new BiomodelsView({model: biomodel});
			this.$elImportModel.append(view.$el);
		},
		addBiomodelView: function () {
			this.$elImportModel.append(this.biomodelView.$el);
		},
		render: function () {
		}
	});
	return SnapView;
});
