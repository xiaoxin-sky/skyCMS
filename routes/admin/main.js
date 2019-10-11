var router = require('koa-router')();
var user = require('./user');
var home = require('./home');
router.get('/',async (ctx,next)=>{
  // console.log(ctx);
  await next();
});
router.use('/user',user);
router.use('/home',home);
module.exports = router.routes();