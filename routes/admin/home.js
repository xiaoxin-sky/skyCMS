var router = require('koa-router')();

router.get('/',async (ctx,next)=>{
  ctx.body = '这是后台主页';
  await next();
});
module.exports = router.routes();