/**
 * @file router
 * @author lanmingming
 * @date 2016-3-14
 */

var Router = require('koa-router');

module.exports = function (app) {

	var router = new Router();

	var siteController = require('../controller/site');
	var mockController = require('../controller/mock');

	// main
	
	router.get('/', siteController.index);
	router.post('/registermock', siteController.registermock);

	// mock
	router.get('/mock/*', mockController.mock);
	router.post('/mock/*', mockController.mock);

	return router.middleware();
}