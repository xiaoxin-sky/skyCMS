const Koa = require('koa');
const router = require('./routes/router');


const app = new Koa();



app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen('3000');
console.log('程序已启动');
