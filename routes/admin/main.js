var router = require('koa-router')();
var login = require('./login');
var user = require('./user');
var home = require('./home');


router.use(async (ctx,next)=>{
  // console.log(ctx);
  if(ctx.session.userInfo){
    await next();
  }else{
    if(ctx.url === "/admin/login"){
      await next();
    }else{
      ctx.render('/admin/login');
    }
  }
});
router.get('/',async (ctx,next)=>{
  // console.log(ctx);
  await next();
});
router.use('/login',login);
router.use('/user',user);
router.use('/home',home);

module.exports = router.routes();