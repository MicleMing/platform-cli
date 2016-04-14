/**
 * @file mock controller
 * @author lanmingming@baidu.com
 * @date 2016-3-18
 */

var Mock = require('mockjs');
var util = require('../util/util');


var _concatBody = util.sort(function (params) {
	return params.map(function (item) {
		return item.param + '=' + item.value
	}).join('&');
});

var _checkRequest = function (req, records) {

	var method = req.method;
	var url = req.url.replace(/^(?:\/mock\/)(.*)(?:\?.*)$/g, function (_, url) {
		return url;
	});
	var query = req.querystring; // 没有 '?'

	var body = req.body ? req.body : [];
	body = Object.keys(body).map(function (item) {
		return {param: item, value: body[item]}
	});
	var queryParams = query.split('&').sort(function (a, b) {
		return a.split('=')[0] > b.split('=')[0];
	});

	var mockUrl = url + '?' + queryParams.join('&') + '||' + _concatBody(body);

	// console.log('records', records);
	// console.log('mockUrl', mockUrl)

	var record = records.filter(function (record) {
		return record._reg.test(mockUrl);
	});

	return record[0];

};

var _checkMethod = function (req, record) {
	var method = req.method;
	return method === record.method;
};

var _checkParams = function (req, records) {
	var queryParams = req.querystring.split('&').map(function (item) {
		return item.split('=')[0]
	}) || [];
	var querySource = records.map(function (record) {
		var params = [];
		(record['params'] || []).forEach(function (i) {
			params.push(i.param);
		});
		return params;
	});
	return querySource.some(function (query) {
		return util.contain(query, queryParams);
	})
};

var _checkBody = function (req, records) {
	var bodyParams = req.body || [];
	bodyParams = Object.keys(bodyParams);
	var bodySource = records.map(function (record) {
		var params = [];
		(record['body'] || []).forEach(function (i) {
			params.push(i.param);
		});
		return params;
	});

	return bodySource.some(function (body) {
		return util.contain(body, bodyParams);
	});
};

var _handlerError = function () {
	var mockError = [];
	var records = this.models.lists.getRecords();
	var request = this.request;

	var record = _checkRequest(request, records);

	if (record) {
		if (!_checkMethod(request, record)) {
			mockError.push('http 请求方法错误');
		};
	}
	if (!_checkParams(request, records)) {
		mockError.push('请求参数错误');
	}
	if (!_checkBody(request, records)) {
		mockError.push('请求body错误')
	};
  
	if (mockError.length > 0) {
		return {error: mockError};
	}
	else {
		return {record: record};
	}
};

module.exports = {

	mock: function *(next) {
		var record;
		var count;
		var response;

		var mockMsg = _handlerError.call(this);

		if ('record' in mockMsg) {
			debugger;
			record = mockMsg.record;
			count = record.count;
			response = record.response.replace(/'/g, '"');
			// console.log(response)
			var json = JSON.parse('{"data|' + count + '":[' + response + ']}');

			json['errno'] = 0;
			var mockData = Mock.mock(json);
			
			this.set("Access-Control-Allow-Origin", "*");
			this.response.status = 200;
			this.body = mockData;
		}
		else {
			this.body = mockMsg.error;
			this.response.status = 500;
		}
	}
}