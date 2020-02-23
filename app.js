const Koa = require('koa');
const router = require('./routes/router');
const render = require('koa-art-template');
const path = require('path');
const static = require('koa-static');
const koaBody = require('koa-body');  
const cors = require('koa2-cors');
const jwt = require('jsonwebtoken');
const koaJwt = require('koa-jwt');
const tokenSecret = require('./model/config').tokenSecret;
const compress = require('koa-compress');


const app = new Koa();
//gzip配置
app.use(compress({
  filter: function (content_type) {
  	return /text/i.test(content_type)
  },
  threshold: 2048,
  flush: require('zlib').Z_SYNC_FLUSH
}))
app.use(async (ctx,next)=>{
  ctx.cookies = true;
  await next();
})
//跨域配置
app.use(cors({
  origin: (ctx) => {
    const origin = ctx.headers.origin  // 实际生产请根据具体情况来进行规则配置
    return origin
 },
 credentials: true
}));
//配置post请求解析模块
app.use(koaBody());

app.use(async (ctx,next)=>{
  ctx.state.__HOST__ = 'http://'+ctx.header.host;
  await next();
})

app.use(function(ctx, next){
  
  return next().catch((err) => {
      if (401 == err.status) {
          ctx.status = 401;
          ctx.body = 'Protected resource, use Authorization header to get access\n';
      } else {
          throw err;
      }
  });
});
app.use(koaJwt({secret:tokenSecret}).unless({
  path:[/login/,/^\/api/]
}));

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
//全局错误捕获
app.on('error', async (err, ctx, next) => {

  // TODO logger errStack
  console.log('全局捕获错误信息：'+err);

  let errStruct = {
      errCode: -20221,
      alert: '服务忙，请稍等(-20221)'
  }

  ctx.res.writeHead(200,{
      'content-Type':'application/json'
  });
  ctx.res.end(JSON.stringify(errStruct));
});

app.listen('3000');
console.log('程序已启动');


