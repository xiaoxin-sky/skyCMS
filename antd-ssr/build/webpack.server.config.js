const merge = require('webpack-merge');
const path = require('path');
const baseConfig = require('./webpack.base.config');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const nodeExternals = require('webpack-node-externals')
module.exports = merge(baseConfig, {
    target: 'node',
    devtool: 'source-map',
    entry: path.resolve(__dirname, '../src/entry.server.js'),
    output: {
        libraryTarget: 'commonjs2'
    },
    externals:nodeExternals({
        whitelist: /\.css$/
    }),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader']
            }
        ]
    },
    plugins: [
        new VueSSRServerPlugin()
    ]
})