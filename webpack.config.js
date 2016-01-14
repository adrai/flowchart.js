var path = require('path');
var webpack = require('webpack');

var bundlename = 'flowchart';
var NODE_ENV = process.env.NODE_ENV || 'development';
var defines = new webpack.DefinePlugin({
	'process.env': {
		'NODE_ENV': JSON.stringify(NODE_ENV)
	}
});

var config = {
	entry: [
		'webpack-hot-middleware/client',
		'./index'
	],
	output: {
		path: path.join(__dirname, 'build'),
		filename: bundlename + '.js',
		publicPath: '/build/'
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		defines
	],
	module: {
		loaders: [
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['', '.js'],
		modulesDirectories: ['src', 'node_modules'],
		alias: {
			'dev/raphael.core.js': './dev/raphael.core.js',
			'raphael.core': './raphael.core.js',
			'raphael.svg': './dev/raphael.svg.js',
			'raphael.vml': './dev/raphael.vml.js'
		}
	}
};

if (NODE_ENV === 'development') {
	config.devtool = 'source-map';
}

if (NODE_ENV === 'production') {
	var minified = process.env.MINIFIED == '1';
	var filename = minified ? bundlename + '-min.js' : bundlename + '.js';
	var uglifyOptions = {
		sourceMap: false,
		comments: false,
		compressor: {
			warnings: false,
			dead_code: true
		}
	};
	if (!minified) {
		uglifyOptions.sourceMap = true;
		uglifyOptions.beautify = true;
		uglifyOptions.mangle = false;
		uglifyOptions.comments = 'all';
	}
	config.entry = './index';
	config.externals = {
		raphael: 'Raphael'
	};
	config.output = {
		path: path.join(__dirname, 'release'),
		filename: filename
	};
	config.plugins = [
		new webpack.optimize.OccurenceOrderPlugin(),
		defines,
		new webpack.optimize.UglifyJsPlugin(uglifyOptions)
	];
}

module.exports = config;
