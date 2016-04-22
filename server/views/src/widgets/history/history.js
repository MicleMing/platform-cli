/**
 * @file history 
 * @author lanmingming@baidu.com
 * @date 2016-3-22
 */

$(function () {

	var storage = window.localStorage || (function () {
		alert('请升级你的浏览器');
		return;
	}) ;

	var group = $('.api-history .list-group');

	function refreshHistory (apiList) {
		try {
			var APIList = apiList || JSON.parse(storage.getItem('APIList'));
		} catch (e) {
		}

		if (!APIList) {
			group.empty();
			return;
		}

		var keys = Object.keys(APIList);
		keys.sort(function (cur, next) {
			return next - cur;
		});
		var createContent = function (data, id) {
			var str = '<div class="list-group-item" data-id=' + id + '>' +
							'<span class="method">' + data.method + '</span>' +
							data.api + 
							'&nbsp;[query = {' + data.params.map(function (item) {return item.param}).join(',') + '}]' +
							'&nbsp;[body = {' + data.body.map(function (item) {return item.param}).join(',') + '}]' +
							'<span class="remove">X</span>' +
						'</div>';
			return str;	
		};

		var groupList = '';
		keys.forEach(function (i) {
			groupList += createContent(APIList[i], i);
		});

		group.html('')
		     .html(groupList);
	}

	refreshHistory();


	var addEvent = window.addEventListener;

	addEvent('storage', function () {
		refreshHistory();
	}, false);

	// 删除 && 填充
	group.on('click', '.list-group-item', function (e) {

		// 删除
		if (e.target.className === 'remove') {
			var id = $(e.target).parent().data('id');
			var APIList = JSON.parse(storage.getItem('APIList'));
			delete APIList[id];
			storage.setItem('APIList', JSON.stringify(APIList));
			refreshHistory(APIList);			
		}
		// 填充
		else {
			var target = $(e.target)
			var id = target.data('id');
			var event = new CustomEvent("apiDetail", {
				detail: {
					id: id,
					status: 'history'
				}
			});

			target
				.addClass('active')
				.siblings()
				.removeClass('active');

			window.dispatchEvent(event);

		}

	});

	// 清除全部历史记录
	var clearAll = $('.history .remove-all');

	clearAll.on('click', function (e) {
		storage.removeItem('APIList');
		refreshHistory();
	})

});