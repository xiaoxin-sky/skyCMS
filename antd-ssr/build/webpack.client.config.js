const merge = require('webpack-merge');
const webpack = require('webpack');
const baseConfig = require('./webpack.base.config');
const path = require('path');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(baseConfig, {
    entry: [path.resolve(__dirname, '../src/entry.client.js')],
    module: {
        rules: [
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
            filename: '[name].[chunkhash].css',
            chunkFilename: '[id].[chunkhash].css'
        }),
        new webpack.DefinePlugin({
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