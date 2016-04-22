/**
 * @file gulp builder
 * @author lanmingming
 * @date 2016-3-10
 */

var path = require('path');
var fs = require('fs');

var gulp = require('gulp');
var concat = require('gulp-concat');
var del = require('del');
var less = require('gulp-less');


var dist = './dist';
var src = './src';
var resource = path.join(path.dirname(__dirname), '/public');

gulp.task('clean', function (cb) {
	del(dist);
	cb();
});

gulp.task('dealJS', function () {
	var jsPath = new Array(
						path.join(src, 'widgets/**/*.js'),
						path.join(src, 'pages/**/*.js'),
						path.join(src, 'lib/js/*.js')
					);

	var stream = gulp.src(jsPath);
	stream
		.pipe(concat('bundle.js'))
		.pipe(gulp.dest(resource + '/script'));

	return stream;

});

gulp.task('dealLess', function () {
	var lessPath = new Array(
							path.join(src, 'widgets/**/*.less'),
							path.join(src, 'pages/**/*.less')
						);

	var stream = gulp.src(lessPath);
	stream
		.pipe(concat('bundle.less'))
		.pipe(less('bundle.css'))
		.pipe(gulp.dest(resource + '/script'));

	return stream;
});

gulp.task('dealLib', function () {
	var root = path.join(__dirname, 'node_modules');
	var depLib = Object.keys(require('./package.json').dependencies);
	var libs = depLib.map(function (item) {
				   var target = JSON.parse(fs.readFileSync(path.join(root, item, 'package.json'))).main;
				   return path.join(root, item, target);
			   });

	var stream = gulp.src(libs.concat([
			path.join(src, 'lib/js/ace/ace.js')
		]));

	stream
		.pipe(gulp.dest(resource + '/libs'));
});

gulp.task('dealEjs', function () {
	var ejsPath = path.join(src, '**/*.ejs');

	var stream = gulp.src(ejsPath);

	stream
		.pipe(gulp.dest(dist));

	return stream;
});

gulp.task('build', ['dealEjs', 'dealJS', 'dealLess', 'dealLib']);

gulp.task('watch', ['build'], function () {
	var jsWatcher = gulp.watch('src/**/*.js', ['dealJS']);
	var lessWatcher = gulp.watch('src/**/*.less', ['dealLess']);
	var ejsWatcher = gulp.watch('src/**/*.ejs', ['dealEjs']);
});

