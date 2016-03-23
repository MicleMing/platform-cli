/**
 * @file input api message
 * @author lanmingming
 * @date 2016-3-15
 */

$(function () {

	var domain = $('input#domain');
	// req-params
	var reqParams = $('.api-config .req-query .params');
	var addReqParam = $('.api-config .req-query .addParam');

	addReqParam.on('click', function (e) {
		e.preventDefault();
		var cloneNode = reqParams.children(':first').clone();
		cloneNode.children('input').val('');
		reqParams.append(cloneNode)
	});

	reqParams.on('click', '.remove', function (e) {
		var removeNode = $(this).parent();
		if (removeNode.siblings().length > 0) {
			removeNode.remove();
		}
		else {
			removeNode.find('input').val('');
		}
	});

	// req-body
	var reqBody = $('.api-config .req-body .params')
	var addreqBody = $('.api-config .req-body .addParam');

	addreqBody.on('click', function (e) {
		e.preventDefault();
		var cloneNode = reqBody.children(':first').clone();
		cloneNode.children('input').val('');
		reqBody.append(cloneNode)
	});

	reqBody.on('click', '.remove', function (e) {
		var removeNode = $(this).parent();
		if (removeNode.siblings().length > 0) {
			removeNode.remove();
		}
		else {
			removeNode.find('input').val('');
		}
	});

	// 提交
	var submitBtn = $('.api-config .submit button');
	var httpMethod =$('.api-config .httpMethod');
	// var responseText = $('.api-config .response textarea');
	var responseCount = $('.api-config .response-count input');

	// response code editor
	var responseEditor = ace.edit('responseJSON')

	submitBtn.on('click', function (e) {
		e.preventDefault();
		var mock = {};

		// api
		var api = domain.val();
		if (!api) {
			alert('请填写API接口');
			return;
		}
		api = api.replace(/(.*\/\/[^\/\?]+)/g, '');

		// 参数
		var params = (function () {
			var params = [];
			reqParams.children().each(function () {
				var item = $(this);
				params.push({
					param: item.find('input').val(),
					validate: item.find('select').val() 
				});
			});
			var queryStr = api.split('?')[1];
			var queryArr = queryStr ? queryStr.split('&').map(function (i) {
				return {param: i.split('=')[0], validate: 'string'}
			}) : [];
			return params.concat(queryArr).filter(function (i) {
				return !!i.param
			});
		})();

		// body
		var body = (function () {
			var body = [];
			reqBody.children().each(function () {
				var item = $(this);
				body.push({
					param: item.find('input').val(),
					validate: item.find('select').val()
				});
			});
			return body.filter(function (i) {
				return !!i.param;
			});
		})();

		// http method
		var http = httpMethod.find('input[name=httpMethod]:checked').val();

		// response
		var response = responseEditor.getValue();

		// mock count
		var count = responseCount.val();

		var data = {
			api: api.split('?')[0],
			method: http,
			params: params,
			body: body,
			response: response,
			count: count
		};
		
		$.ajax({
			url: '/registermock',
			method: 'POST',
			data: data
		}).done(function (res) {
			alert('设置成功');
			saveAPI(data);
		}).error(function (err) {
			alert(err.responseJSON.tip)
		});
	});
	function saveAPI (data) {
		var storage  = window.localStorage;
		var APIList = JSON.parse(storage.getItem('APIList') || '{}');

		// 历史纪录不超过50条
		var keys = Object.keys(APIList);
		keys.sort(function (cur, next) {
			return cur < next;
		});

		if (keys.length > 50) {
			for (var i = 50; i < keys.length; i++) {
				delete APIList[keys[i]];
			}
		}

		var _id = Date.now();
		APIList[_id] = data;
		storage.setItem('APIList', JSON.stringify(APIList));

		// 原生 storage 事件在大部分浏览器中只能在另外的窗口触发
		var storageEvent = document.createEvent('Event');
		storageEvent.initEvent('storage', true, true);
		window.dispatchEvent(storageEvent);
	};

	var addEvent = window.addEventListener;

	addEvent('apiDetail', function (e) {
		var storage = window.localStorage;
		var id = e.detail.id;
		var APIList = JSON.parse(storage.getItem('APIList'));
		var apiDetail = APIList[id];

		fillForm(apiDetail);
	});

	function cloneTarge (target, params) {
		var cloneNode = target.children(':first').clone();
		target.empty();
		params.forEach(function (item) {
			cloneNode.find('input').val(item.param);
			cloneNode.find('select').val(item.validate);
			target.append(cloneNode);
			cloneNode = cloneNode.clone();
		});			
	}

	function fillForm (data) {
		var api = data.api;
		var method = data.method;
		var params = data.params;
		var body = data.body;
		var response = data.response;
		var count = data.count;

		domain.val(api);

		var elements = httpMethod.find('input[name=httpMethod]');
		elements.each(function (i) {
			if (this.value === method) {
				this.checked = true;
			}
		});

		cloneTarge(reqParams, params);
		cloneTarge(reqBody, body);

		responseEditor.setValue(response);
		responseEditor.moveCursorTo(0);

		responseCount.val(count);

	}

	// param API
	var paramsAPI = $('.form-group .params-api');

	paramsAPI.on('click', function (e) {

		e.preventDefault();

		var api = domain.val();

		api = api.replace(/(.*\/\/[^\/\?]+)/g, '');

		var path = api.split('?')[0];
		var query = api.split('?')[1];

		domain.val(path ? path : '/');

		var queryParams = query ? query.split('&').map(function (item) {
			var itemArr = item.split('=');
			return {param: itemArr[0], validate: 'string'}
		}): [{param:'', validate: ''}];
		
		cloneTarge(reqParams, queryParams)
	});
})

