/**
 * Module dependencies.
 */
var express = require('express'),
	routes = require('./routes'),
	user = require('./routes/user'),
	sbml2matlab = require('./routes/sbml2matlab'),
	biomodels = require('./routes/biomodels'),
	chebi = require('./routes/chebi'),
	simulator = require('./routes/simulator'),
	http = require('http'),
	path = require('path');
var app = express();
app.configure(function() {
	app.set('port', 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.cookieParser('your secret here'));
	app.use(express.session());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});
app.configure('development', function() {
	app.use(express.errorHandler());
	app.locals.pretty = true;
});
app.get('/', routes.index);
app.get('/users', user.list);
app.all('/biomodels', biomodels.getModel);
app.all('/chebi', chebi.getModelIds);
app.post('/sbml2matlab', sbml2matlab.translate);
app.post('/simulator', simulator.libsbmlsim);
http.createServer(app).listen(app.get('port'), function () {
	console.log("Express server listening on port " + app.get('port'));
});
