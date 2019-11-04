var router = require('koa-router')();
const tools = require(process.cwd()+'/model/tools');

router.get('*',async (ctx,next)=>{
  await next();
});
router.post('*',async (ctx,next)=>{
  await next();
});
/**
 * 当前main方法实现了根据url自动加载controller
 * get参数需要通过如下方式传递?id=1
 * 未来想实现get请求通过斜杠(/)方式传递参数
 */
router.use(async (ctx,next)=>{  /*
    使用正则匹配到过滤掉静态资源文件，例如css，js等，只处理html模板文件 
    此处只能匹配到结尾路径，如/admin/login 只能匹配到/login或者/login?code=1
   */
  let staticReg = /(\/\w{1,})$|(\/\w{1,}\?{1}.*)$/;
  if(!ctx.url.match(staticReg)){
    await next();
  }else{
    //匹配不带参数的网址
    let reg = /(?<=\/)[A-Za-z0-9]{1,}/g;
    let pathArr = ctx.url.match(reg);
    // var view = process.cwd()+'/views'+ctx.url+'.html';
    if(pathArr.length==1){
      let backendPath = pathArr[0];
      let backendExit = await  tools.controllerExit(ctx,backendPath).catch(()=>ctx.render('404'));
      
      if(backendExit){//如果输入了正确的后台地址
        if(ctx.session.userInfo){//已经是登录状态
          ctx.url = ctx.url+'/index/index';
          await require(tools.getControllerPath(backendPath+'/index'))(ctx);
        }else{
          ctx.url = ctx.url+'/login/index';
          await require(tools.getControllerPath(backendPath+'/login'))(ctx);
        }
      }else{
        console.log(backendExit);
      }
    }else if(pathArr.length<=3){
      let  method = pathArr.length==3 ? pathArr.pop() :'index';
      let path = '/'+pathArr.join('/');
      let controllerExit =await  tools.controllerExit(ctx,path).catch(()=>ctx.render('404'));
      
      if(controllerExit){
        await require(tools.getControllerPath(path))(ctx,method);
        await next();
      }
    }
  }
});


module.exports = router.routes();