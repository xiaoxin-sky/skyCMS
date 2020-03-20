const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const bundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist/vue-ssr-client-manifest.json');
const template = require('fs').readFileSync('./template.html', 'utf-8');
const { createBundleRenderer } = require('vue-server-renderer')
const favicon = require('koa-favicon');
const compress = require('koa-compress');

//koa2 HRM需要做下面的不支持webpack4
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const config = require('./build/webpack.client.config.js');
// const compiler = webpack(config);
// app.use(webpackDevMiddleware(compiler, {
//     publicPath: config.output.publicPath
// }));
const renderer = createBundleRenderer(bundle, {
    template,
    clientManifest,
    runInNewContext: false
})
app.use(static('./dist'));
app.use(static('./public'));
app.use(favicon('./public/favicon.ico', {
    maxage: 1000 * 60 * 15
}));
app.use(compress({
    filter: function (content_type) {
        return /text/i.test(content_type)
    },
    threshold: 2048,
    flush: require('zlib').Z_SYNC_FLUSH
}))

app.use(async (ctx, next) => {
    
    const context = {
        url: ctx.url
    }
    let html = await renderer.renderToString(context);
    ctx.body = html;
    await next();
})
app.listen(3001);
console.log('启动成功:', 'http://localhost:3001/');
