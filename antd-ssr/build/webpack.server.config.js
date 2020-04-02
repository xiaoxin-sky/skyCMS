const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals')
const webpack = require('webpack');
const isProd = process.env.NODE_ENV === 'production';
module.exports = merge(baseConfig, {
    target: 'node',
    entry: path.resolve(__dirname, '../src/entry.server.js'),
    output: {
        libraryTarget: 'commonjs2'
    },
    externals:nodeExternals({
        whitelist: /\.(s)?css$/,
        modulesFromFile:{ 
            include :[ 'vue-style-loader','sass-loader',"style-loader", "css-loader" ] 
        }
    }),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                ]
            },
        ]
    },
    plugins: [
        new VueSSRServerPlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
    ]
})