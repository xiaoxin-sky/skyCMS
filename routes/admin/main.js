var router = require('koa-router')();
var fs = require('fs');



/* router.use(async (ctx,next)=>{
  if(ctx.session.userInfo){
    await next();
  }else{
    if(ctx.url === "/admin/login" || ctx.url === '/admin/login/doLogin'){
      await next();
    }else{
      ctx.redirect('/admin/login');
    }
  }
}) */

router.get('*',async (ctx,next)=>{
  /* 
    使用正则匹配到过滤掉静态资源文件，例如css，js等，只处理html模板文件 
    此处只能匹配到结尾路径，如/admin/login 只能匹配到/login
  */
  let reg = /(\/\w{1,})$|(\/\w{1,}\?{1}.*)$/;
  // console.log(ctx.url.match(reg));
  if( ctx.url.match(reg) ){
    let controller = process.cwd()+'/routes'+ctx.url+'.js';
    let view = process.cwd()+'/views'+ctx.url+'.html';
    var controllerExit = await fileExist(controller).catch(e=>{
      console.log(e);
    });
    var viewExit = await fileExist(view).catch(e=>{
      console.log(e);
    });
    if(controllerExit && viewExit){
      require(controller)(ctx);
    }else{
      ctx.status = 404;
    }
  }else{
    await next();
  }
 
});
function fileExist(path){
  return new Promise((resolve,reject)=>{
    fs.access(path, fs.constants.F_OK, (err) => {
      if(err) reject(err);
      resolve(true);
    });
  });
}


/* router.use('/login',login);
router.use('/user',user);
router.use('/home',home); */

module.exports = router.routes();