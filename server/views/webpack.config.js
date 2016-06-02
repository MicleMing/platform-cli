/**
 * @webpack config
 * @author lanmingming
 * @date 2016-5-31
 */
var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var abs = function (p) {
    return path.join(__dirname, p);
};

var dist = abs('dist');
var src = abs('src');

var pages = fs.readdirSync(path.join(src, 'pages')).filter(function (i) {
    return i.indexOf('.') !== 0
});

var entry = {};

pages.forEach(function (page) {
    entry[page] = path.join(src, 'pages', page, page);
});
console.log(entry)

module.exports = {

    context: src,

    entry: entry,

    output: {
        path: dist,
        filename: "pages/[name]/[name].js"
    },

    resolve: {
        root: src,
        alias: {
            lib: path.join(src, 'lib'),
            widgets: path.join(src, 'widgets')
        }
    },

    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            },
            {
                test: /\.json$/,
                loader: 'json'
            }
        ],
        noParse: [
            /lib(\/|\\)js(\/|\\)ace\1/,
            /lib(\/|\\)js(\/|\\)jquery\1/
        ]
    },

    plugins: [
        new ExtractTextPlugin('pages/[name]/[name].[contenthash].css'),
    ]
}




