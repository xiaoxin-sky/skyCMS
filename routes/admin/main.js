var router = require('koa-router')();
var fs = require('fs');



router.use(async (ctx,next)=>{
  let reg = /(\/\w{1,})$|(\/\w{1,}\?{1}.*)$/;
  if( ctx.url.match(reg) ){
    if(ctx.session.userInfo){
      await next();
    }else{
      // ctx.url.match(/(\/admin\/login\/\?{1}.*)$/);匹配login后面传递的参数
      if(ctx.url.match(/\/admin\/login|(\/admin\/login\/\?{1}.*)$/) || ctx.url === '/admin/doLogin'){
        await next();
      }else{
        ctx.redirect('/admin/login');
      }
    }
  }else{
    await next();
  }
  
})


router.get('*',async (ctx,next)=>{
  /*
    使用正则匹配到过滤掉静态资源文件，例如css，js等，只处理html模板文件 
    此处只能匹配到结尾路径，如/admin/login 只能匹配到/login或者/login?code=1
   */
  
  let reg = /(\/\w{1,})$|(\/\w{1,}\?{1}.*)$/;
  // console.log(ctx.url.match(reg));
  
  if( ctx.url.match(reg) ){
    //判断请求中是否带有参数
    // JSON.stringify(ctx.query) == '{}';
    
    console.log(ctx.url);
    //自定义get参数对象，防止提出参数后，ctx.query获取不到get参数
    ctx.pathParams = ctx.query;
    //如果包含参数，剔除掉参数/admin/login?mycode=1  =》 /admin/login
    /* if(JSON.stringify(ctx.query) != '{}'){
      ctx.url = ctx.url.match(/(\/\w{1,}){1,}/)[0];
    } */
    ctx.query = '';
    
    let controller = process.cwd()+'/routes'+ctx.url+'.js';
    let view = process.cwd()+'/views'+ctx.url+'.html';
    var controllerExit = await fileExist(controller).catch(e=>{
      console.log(e);
    });
    var viewExit = await fileExist(view).catch(e=>{
      console.log(e);
    });
    if(controllerExit && viewExit){
    await require(controller)(ctx);
    }else{
      ctx.status = 404;
    }

    
      
  }else{
    await next();
  }
    
});

router.post('*',async (ctx,next)=>{
  let reg = /(\/\w{1,})$/;
  if( ctx.url.match(reg) ){
    let api = process.cwd()+'/api'+ctx.url+'.js';
    var apiExit = await fileExist(api).catch(e=>{
      console.log(e);
    });
    if(apiExit){
      await require(api)(ctx);
    }else{
      ctx.status = 404;
    }
  }else{
    await next();
  }
})


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