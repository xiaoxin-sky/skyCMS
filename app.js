const Koa = require('koa');
const router = require('./routes/router');
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const session = require('koa-session');
const koaBody = require('koa-body');  

const app = new Koa();

app.use(koaBody());

//配置session
app.keys = ['some secret hurr'];
const CONFIG = {
  key: 'koa:sess', /** (string) cookie key (default is koa:sess) */
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400,
  autoCommit: true, /** (boolean) automatically commit headers (default true) */
  overwrite: true, /** (boolean) can overwrite or not (default true) */
  httpOnly: true, /** (boolean) httpOnly or not (default true) */
  signed: true, /** (boolean) signed or not (default true) */
  rolling: true, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
  renew: true, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
};
 
app.use(session(CONFIG, app));
 

app.use(async (ctx,next)=>{
  ctx.state.__HOST__ = 'http://'+ctx.header.host;
  await next();
})

// 开启路由
app
  .use(router.routes())
  .use(router.allowedMethods());
// 配置模板文件
render(app, {
  root: path.join(__dirname, 'views'),
  extname: '.html',
  debug: process.env.NODE_ENV !== 'production'
});

//配置静态资源
app.use(static(__dirname+'/public/'));

app.listen('3000');
console.log('程序已启动');
console.log(path.join(__dirname));


