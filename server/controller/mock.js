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
    var url = req.url.replace(/^(?:\/mock\/)([^\?]*)/g, function (_, url) {
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


// 通过所有参数检查
var _checkParams = function (req, record) {
    var queryParams = (
            req.querystring.split('&')
            .map(function (item) {
                return item.split('=')[0]
            }) || []
        )
        .filter(function (i) {
            return i;
        });
    var querySource = record.params.map(function (item) {
        return item.param;
    });
    return util.contain(querySource, queryParams);
};

var _checkBody = function (req, record) {
    var bodyParams = req.body || [];
    bodyParams = Object.keys(bodyParams);
    var bodySource = record.body.map(function (item) {
        return item.param;
    });
    return util.contain(bodySource, bodyParams);
};

var _handlerError = function () {
    var mockError = [];
    var recordsModel = this.models.lists;
    var records = recordsModel.getRecords();
    var request = this.request;

    // 获取api
    var record = _checkRequest(request, records);
    if (!record) {
        var api = request.path.replace(/^\/mock\//, '');
        var similarRecord = recordsModel.getByApi(api)[0];

        if (!similarRecord) {
            return {error: ['该接口还未进行mock, 请先注册']};
        }

        if (!_checkMethod(request, similarRecord)) {
            mockError.push('http 请求方法错误');
        };
        if (!_checkParams(request, similarRecord)) {
            mockError.push('请求参数错误');
        }
        if (!_checkBody(request, similarRecord)) {
            mockError.push('请求body错误')
        }
        return {error: mockError};
    }
    else {
        return {record: record};
    }
};

module.exports = {

    mock: function *(next) {
        var record;
        var response;

        var mockMsg = _handlerError.call(this);

        if ('record' in mockMsg) {
            // console.log(mockMsg)
            record = mockMsg.record;
            response = record.response.replace(/'/g, '"');

            var json = JSON.parse(response)
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