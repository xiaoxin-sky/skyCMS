const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
module.exports = {
    output: {
        filename: '[name].[chunkhash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    mode: 'development',
    stats: 'errors-only',
    devtool: 'inline-source-map',
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../src')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    extractCSS: true
                }
            }, {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new ProgressBarPlugin({
            format: '  build '+chalk.green.bold('[:bar]' ) + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            complete:'◾'
        }),
        new CompressionWebpackPlugin()
    ]
}