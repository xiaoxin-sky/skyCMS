var router = require('koa-router')();

router.get('/',async (ctx,next)=>{
  ctx.body = '这是用户后台界面';
  await next();
});
module.exports = router.routes();