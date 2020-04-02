const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const isProd = process.env.NODE_ENV === 'production';
module.exports = {
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, '../dist'),
        publicPath: '/'
    },
    mode: process.env.NODE_ENV,
    stats:isProd ? {
        entrypoints:false,
        modules:false,
    } : 'normal',
    devtool: isProd ? 'false':'inline-source-map',
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
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader',
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            // disable: true, // webpack@2.x and newer
                            mozjpeg: {
                                progressive: true,
                                quality: 65
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.65, 0.90],
                                speed: 4
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                            // the webp option will enable WEBP
                            webp: {
                                quality: 75
                            }
                        },
                    },
                ]
            },
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new FriendlyErrorsWebpackPlugin(),
        new ProgressBarPlugin({
            format: '  build ' + chalk.green.bold('[:bar]') + chalk.green.bold(':percent') + ' (:elapsed seconds)',
            complete: '◾'
        }),
        new CompressionWebpackPlugin(),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /ja|it/),
        // new BundleAnalyzerPlugin(),

    ]
}