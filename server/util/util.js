/**
 * @file tool function
 * @author lanmingming@baidu.com
 */

var copy = function (target, source) {
    target = target || {};

    for (var key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = source[key];
        }
    }
    return target;
};

var sort = function (handler) {

    return function (params) {
        params = params.sort(function (a, b) {
            return a.param > b.param;
        });
        return handler(params);
    }
};

var contain = function (source, target) {
    if (source.length !== target.length) {
        return false;
    }
    if (source.length === 0) {
        return true;
    }
    source.sort(function (a, b) {
        return a > b;
    });
    target.sort(function (a, b) {
        return a > b;
    });
    return source.every(function (item, index) {
        return item === target[index];
    })
};

var sortAndConcat = sort(function (params) {
    return params.map(function(item) {
        return item.param + ':' + item.validate;
    }).join('&');
});

var sortAndToReg = sort(function (params) {

    return params.map(function (item) {
        return '(' + item.param + '=' + '[\\s\\S]*)';
    }).join('&');
});

module.exports = {
    copy: copy,
    sort: sort,
    sortAndConcat: sortAndConcat,
    sortAndToReg: sortAndToReg,
    contain: contain
};