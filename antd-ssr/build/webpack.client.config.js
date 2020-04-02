const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const path = require('path');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(baseConfig, {
    entry: {
        app:path.resolve(__dirname, '../src/entry.client.js')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    isProd ? { loader: MiniCssExtractPlugin.loader } : 'style-loader',
                    'css-loader']
            },
          /*   {
                test: /\.scss$/,
                use: [isProd ? { loader: MiniCssExtractPlugin.loader }  : 'vue-style-loader', 'css-loader', 'postcss-loader',
                  {
                    loader: 'sass-loader',
                    options: isProd ? {} : {sourceMap: 'inline'}
                  }
                ]
            }, */
            // {
            //     test: /\.scss$/,
            //     use: ["style-loader", "css-loader", "sass-loader"]
            // },
        ]
    },
    plugins: isProd?[
        new VueSSRClientPlugin(),
        new CleanWebpackPlugin(), 
        new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[name].[id].[chunkhash].css'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        }),
        new OptimizeCssAssetsPlugin()

    ]:[
        new VueSSRClientPlugin(),
        new CleanWebpackPlugin(), 
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"client"'
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                antd_es:{
                    test: (module) => {
                        let node_modules = /[\\/]node_modules[\\/]/.test(module.context);
                        if(node_modules){
                            return /ant-design-vue[\\/]es/.test(module.context);
                        }else{
                            return false;
                        }
                    //   return /ant-design-vue[\\/]es[\\/]/.test(module.context);
                    }, // 直接使用 test 来做路径匹配，抽离react相关代码
                    chunks: "all",
                    name: "antd_es",
                    priority: 20,
                },
                vendor: {
                    name: "vendor",
                    test:/[\\/]node_modules[\\/]/,
                    chunks: "all",
                    priority: 10, // 优先级,
                },
                //目前公共组件不需要提取
                common: {
                    name: "common",
                    test: /[\\/]src[\\/]/,
                    minSize: 1024,
                    chunks: "all",
                    priority:5
                }
            }
        }
    },
})