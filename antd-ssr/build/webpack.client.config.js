const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const path = require('path');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
module.exports = merge(baseConfig, {
    entry: [path.resolve(__dirname, '../src/entry.client.js')],
    module:{
        rules:[
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            esModule: true,
                        },
                    },
                    'css-loader']
            }
        ]
    },
    plugins: [
        new VueSSRClientPlugin(),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename:'[name].[chunkhash].css',
            chunkFilename:'[id].[chunkhash].css'
        }),
        
        
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    name: "vendor",
                    test: /[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10 // 优先级
                },
                common: {
                    name: "common",
                    test: /[\\/]src[\\/]/,
                    minSize: 1024,
                    chunks: "all",
                    priority: 5
                }
            }
        }
    },
})