/**
 * @file config entry
 * @author lanmingming
 * @date 2016-3-14
 */

"use strict";

var path = require('path');

var env = process.env.NODE_ENV || 'development';
var port = process.env.PORT || 4000;
var host = 'http://localhost' + (port !== 80 ? ':' + port : '');

var DEBUG = env !== 'production';

module.exports = {
	name: 'mockApi',
	port: port,
	env: env,
	bodyparser: {
		//multipart: true
	},
	koaBody: {
		formidable: {
			uploadDir: __dirname
		},
		multipart: true
	},
	static: {
		directory: path.resolve(__dirname, '../public')
	},
	view: {
		viewExt: 'ejs',
		layout: false,
		cache: false,
		root: path.resolve(__dirname, '../views/dist/')
	}
}