
var koa = require('koa');
var render = require('koa-ejs');
var koaBody = require('koa-body');

var koaStatic = require('koa-static');

var configs = require('./configs/main');
var router = require('./router/router');
var List = require('./model/list');


var setUpServer = function (port) {

	var app = module.exports = koa();
	render(app, configs.view)

	// app.use(require('koa-bodyparser')(configs.bodyparser));
	app.use(koaBody(configs.koaBody));
	app.use(koaStatic(configs.static.directory, {}));

	app.context.models = {};
	app.context.models.lists = new List;


	app.use(router())


	if (!module.parent) {
		app.listen(port || configs.port, function () {
			console.log('Server runnin on port: ' + port || configs.port);
		})
	}
	else {
		module.exports = app;
	}
};

models.exports = setUpServer;

