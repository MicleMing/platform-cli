var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var webpack = require('webpack')

var WEBPACK_CONFIG = require('./webpack.config.js');

var compiler = webpack(WEBPACK_CONFIG);



var handleErrors = function(errors) {
    errors.forEach(function (err) {
        console.log(err);
    })
};

var normalCompiler = function () {

    compiler.run(function (err, stats) {
        if (err) {
            console.log(err);
        }
        var jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0) {
            handleErrors(jsonStats.errors)
        }
    });
};

var doWatch = function () {

    compiler.watch({
        aggregateTimeout: 300,
        poll: true
    }, function (err, stats) {
        if (err) {
            console.log(chalk.red(err));
        }
        var jsonStats = stats.toJson();
        if (jsonStats.errors.length > 0) {
            handleErrors(jsonStats.errors);
        }
    })
};

var builderMode = function (mode) {
    switch (mode) {
        case 'watch':
            doWatch();
            break;
        default:
            normalCompiler();
    }
};

module.exports = {
    builder: builderMode
};




