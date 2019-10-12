var router = require('koa-router')();

router.get('/',async (ctx,next)=>{
  // console.log(ctx);
  ctx.render('admin/login');
});
router.post('/doLogin',async (ctx)=>{
  console.log(ctx);
  
});
module.exports = router.routes();