/**
 * @file gulp builder
 * @author lanmingming
 * @date 2016-3-10
 */

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var del = require('del');

var webpackBuilder = require('./builder.js').builder;


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

gulp.task('runWebPack', function (done) {
    return webpackBuilder('normal');
});

gulp.task('build', ['dealEjs', 'runWebPack']);

gulp.task('watch', ['dealEjs'], function () {
    var ejsWatcher = gulp.watch('src/**/*.ejs', ['dealEjs']);
    webpackBuilder('watch')
});

