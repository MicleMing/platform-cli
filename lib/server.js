/**
 * @file server
 * @author lanmingming@baidu.com
 */


var app = require('../server/app');

var port = process.env.port;

app.listen(port, function () {
	console.log('server listen on %s', port);
})
