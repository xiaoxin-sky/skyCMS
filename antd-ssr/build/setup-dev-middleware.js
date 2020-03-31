const path = require('path')
const MFS = require('memory-fs')
const webpack = require('webpack')
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')
const webpackDevMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const convert = require('koa-convert')
const open = require('open')
const readFile = (fs, file) => fs.readFileSync(path.join(clientConfig.output.path, file), 'utf-8')

module.exports = function setupDevServer(app, template, callback) {
  let bundle;
  let clientManifest;
  const update = () => {
    if (bundle && clientManifest) {
      callback(bundle, {
        template,
        clientManifest
      })
    }
  }

  //  client
  clientConfig.entry.app = ['webpack-hot-middleware/client?path=/__webpack_hmr&timeout=2000&reload=true', clientConfig.entry.app]
  clientConfig.output.filename = '[name].js'
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  )

  // webpack config
  const clientCompiler = webpack(clientConfig)
  // dev middleware
  const devMiddleware = webpackDevMiddleware(clientCompiler, {
    publicPath: clientConfig.output.publicPath,
    noInfo: true,
    stats: {
      colors: true,
      modules: false,
    },
  })
  app.use(convert(devMiddleware))

  // hot update
  clientCompiler.plugin('done', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    
    console.log('\nclient-dev...\n')
    clientManifest = JSON.parse(readFile(
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))
    update()
  })

  // hot middleware
  app.use(convert(webpackHotMiddleware(clientCompiler)))

  // server
  const serverCompiler = webpack(serverConfig)
  const mfs = new MFS()
  serverCompiler.outputFileSystem = mfs
  serverCompiler.watch({}, (err, stats) => {
    if (err) throw err
    stats = stats.toJson()
    if (stats.errors.length) return
    console.log('server-dev...')
    bundle = JSON.parse(readFile(mfs, 'vue-ssr-server-bundle.json'))
    update()
  })

  devMiddleware.waitUntilValid(() => {
    console.log('\n> Listening at http://localhost:3001' + '' + '\n')
    open('http://localhost:3001/');
  })
}
