
define(function (require, exports, module) {
    var $ = require('lib/js/jquery');
        var addRule = $('.proxy .proxy-wrap .add-rule');
    var ruleList = $('.proxy .proxy-wrap .rule-list')

    var tempNode = $('.proxy .proxy-list').children(':first').clone();
    addRule.on('click', function (e) {
        ruleList.append(tempNode);
    });
});