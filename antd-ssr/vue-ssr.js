

const { createBundleRenderer } = require('vue-server-renderer')
const isProd = process.env.NODE_ENV === 'production';
const axios = require('axios');
module.exports = function(app,templatePath){
    const template = require('fs').readFileSync(templatePath, 'utf-8');
    let renderer;
    const renderData = (ctx, renderer) => {
        const context = {
          url: ctx.url
        }
        return new Promise((resolve, reject) => {
          renderer.renderToString(context, (err, html) => {
            if (err) {
              return reject(err)
            }
            resolve(html)
          })
        })
    }
    if(isProd){
        const bundle = require('./dist/vue-ssr-server-bundle.json');
        const clientManifest = require('./dist/vue-ssr-client-manifest.json');
        renderer = createBundleRenderer(bundle, {
            template,
            clientManifest,
            runInNewContext: false
        })
    }else{
        const setupDevServer = require('./build/setup-dev-middleware');
        setupDevServer(app, template, (bundle, options) => {
            try {
                renderer = createRenderer(bundle, options)
            } catch (e) {
                console.log('\nbundle errorasdasd', e)
            }
        })
    }
    app.use(async (ctx, next) => {
        if (ctx.url === '/sitemap.xml') {
            ctx.set({
                'Content-Type': 'application/xml'
            })
            let res = await axios.get('https://api.9cka.cn/sitemap.xml', {
                responseType: 'arraybuffer'
            });
            ctx.body = res.data;
            return;
        }
        let html, status
        try {
            status = 200
            html = await renderData(ctx, renderer)
        } catch (e) {
            console.log('\ne', e)
            if (e.code === 404) {
                status = 404
                html = '404 | Not Found'
            } else {
                status = 500
                html = '500 | Internal Server Error'
            }
        }
        ctx.type = 'html'
        ctx.status = status ? status : ctx.status
        ctx.body = html
    })
}
function createRenderer(bundle, options) {
    return createBundleRenderer(bundle, Object.assign(options, {
        /*  cache: LRU({
             max: 1000,
             maxAge: 1000 * 60 * 15
         }), */
        runInNewContext: false
    }))
}