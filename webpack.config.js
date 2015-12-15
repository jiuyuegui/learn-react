module.exports = {
	entry: {
		'home/index': './src/js/home/index',
		'search/index': './src/js/search/index',
		'test/index': './src/js/test/index'
	},
	output: {
		path: __dirname + '/build/js/',
		publicPath: '/assets/js/',
		filename: '[name].bundle.js'
	},
	module: {
		loaders: [
			{ test: /.js/, exclude: /node_modules/, loaders: ['babel-loader'] },
			{ test: /.less/, exclude: /node_modules/, loaders: ['style-loader', 'css-loader', 'less-loader']}
		]
	}

}