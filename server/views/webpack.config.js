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
var assetsPath = '../../'

var pages = fs.readdirSync(path.join(src, 'pages')).filter(function (i) {
    return i.indexOf('.') !== 0
});

var genResourceMap = function (resourceMap) {
    if (!fs.existsSync(dist)) {
        fs.mkdirSync(dist);
    }
    fs.writeFileSync(
        path.join(dist, 'resource-map.js'),
        'var resourceMap = (' + resourceMap + ');'
    );
};

var entry = {};

pages.forEach(function (page) {
    entry[page] = path.join(src, 'pages', page, page);
});

module.exports = {

    context: src,

    entry: entry,

    output: {
        path: dist,
        filename: "pages/[name]/[name].[hash].js"
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
            /lib(\/|\\)js(\/|\\)jquery\1/
        ]
    },

    plugins: [
        new ExtractTextPlugin('pages/[name]/[name].[hash].css'),
        function () {
            this.plugin('done', function (stats) {
                stats = stats.toJson();
                var resourceMap = {};

                var addBase = function (asset) {
                    return assetsPath + asset;
                };
                pages.forEach(function (name) {
                    var assets = stats.assetsByChunkName[name];
                    resourceMap[name] = (Array.isArray(assets) ? assets : [assets]).map(addBase);
                });

                genResourceMap(
                    JSON.stringify(resourceMap, null, 4)
                );
            });
        }
    ]
}




