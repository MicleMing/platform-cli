/**
 * @file list model
 * @author lanmingming
 * @date 2016-3-16
 */

var util = require('../util/util');

var _copy = util.copy;
var _sortAndConcat = util.sortAndConcat;
var _sortAndToReg = util.sortAndToReg;

function List () {
	this.records =  [];
	this.current = {};
};

var proto = List.prototype;


var _createId = function (record) {

	return [
				record.api,
				_sortAndConcat(record.params),
				_sortAndConcat(record.body),
				JSON.stringify(record.response), 
				record.count
			].join('&');
};

var _createReg = function (record) {
	return new RegExp(
			'^' + record.api + 
			'\\?' + _sortAndToReg(record.params) + 
			'\\|\\|' + _sortAndToReg(record.body) + 
			'\$');
};

proto.checkId = function (id) {
	return this.records.filter(function (record) {
		return record['_Id'] == id;
	})[0];
};

proto.getRecords = function () {
	return this.records;
};

proto.setApi = function (api) {
	this.current['api'] = api;
};
proto.getApi = function (api) {
	return this.records[api];
};

proto.setMethod = function (method) {
	this.current['method'] = method;
};

proto.setParams = function (params) {
	this.current['params'] = params;
};
proto.setBody = function (body) {
	this.current['body'] = body;
};
proto.setResponse = function (response) {
	this.current['response'] = response;
};
proto.setCount = function (count) {
	this.current['count'] = count;
};
proto.save = function () {

	var target = _copy({}, this.current);
	target['_Id'] = _createId(target);
	target['_reg'] = _createReg(target);
	this.current = {};

	var checkRecord;
	if (checkRecord = this.checkId(target['_Id'])) {
		var index = this.records.indexOf(checkRecord);
		this.records.splice(index, 1, target);
	}
	else {
		this.records.push(target);
	}
	checkRecord = null;
	
	return target;
};

module.exports = List;
