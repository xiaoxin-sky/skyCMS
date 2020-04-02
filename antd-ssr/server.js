const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');
const favicon = require('koa-favicon');
const compress = require('koa-compress');
const ssr = require('./vue-ssr');
app.use(static('/'));
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
ssr(app,'./template.html')
app.listen(3001);
console.log('启动成功:', 'http://localhost:3001/');

