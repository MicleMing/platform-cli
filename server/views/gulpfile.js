/**
 * @file gulp builder
 * @author lanmingming
 * @date 2016-3-10
 */

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var del = require('del');
var gutil = require('gutil');
var webpack = require('webpack')

var WEBPACK_CONFIG = require('./webpack.config.js');
var dist = './dist';
var src = './src';

gulp.task('clean', function (cb) {
    del(dist);
    cb();
});

gulp.task('dealEjs', function () {
    var ejsPath = path.join(src, '**/*.ejs');

    var stream = gulp.src(ejsPath);

    stream
        .pipe(gulp.dest(dist));

    return stream;
});

function onBuild(done) {
    return function(err, stats) {
        if (err) {
            gutil.log('Error', err);
            if (done) {
                done();
            }
        } else {
            Object.keys(stats.compilation.assets).forEach(function(key) {
                gutil.log('Webpack: output ', key);
            });
            if (done) {
                done();
            }
        }
    }
}


gulp.task('runWebPack', function (done) {
    return webpack(WEBPACK_CONFIG).run(onBuild(done));
});

gulp.task('build', ['dealEjs', 'runWebPack']);

gulp.task('watch', ['build'], function () {
    var ejsWatcher = gulp.watch('src/**/*.ejs', ['dealEjs']);
});

