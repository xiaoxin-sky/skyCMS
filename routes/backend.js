const router = require('koa-router')();
const tools = require(process.cwd()+'/model/tools');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const tokenSecret = require(process.cwd()+'/model/config').tokenSecret;

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
router.use(async (ctx,next)=>{  
  /*
    使用正则匹配到过滤掉静态资源文件，例如css，js等，只处理html模板文件 
    此处只能匹配到结尾路径，如/admin/login 只能匹配到/login或者/login?code=1
   */

  let pathArr = pathToArr(ctx);
  let backendPath = pathArr.length != 0 ? pathArr[0] : null;
  if( backendPath && fs.existsSync( `${process.cwd()}/controller/${pathArr[0]}` ) ){//如果输入正确后台地址
    if(pathArr.length==1){
      
        if(ctx.session.userInfo){//已经是登录状态
          await  runderBackendPath(ctx,`${backendPath}/index`);
        }else{
          await  runderBackendPath(ctx,`${backendPath}/login`);
        }
    }else if(pathArr.length<=3){
      
      let method = pathArr.length==3 ? pathArr.pop() :'index';
      let path = '/'+pathArr.join('/');
      
      let absolutePath = await  tools.controllerExit(ctx,path).catch(()=>ctx.render('404'));

      await require(absolutePath)(ctx,method);
    }
  }else{
    ctx.render('404');
  }
  
  await next();
});
/**
 * 渲染后台加载地址
 * @param {object} ctx 上下文对象
 * @param {*} backendPath 控制器类文件地址
 */
async function runderBackendPath(ctx,backendPath){
  ctx.url = `${backendPath}/index`;
  
  let controllerExit =await  tools.controllerExit(ctx,backendPath).catch(()=>ctx.render('405'));
  if(controllerExit){
    try {
      await require(tools.getControllerPath(backendPath))(ctx);
    } catch (error) {//如果请求的方法未定义
      ctx.render('405')
    }
  }
}
/**
 * url转换成数组 
 * 使用正则匹配到过滤掉静态资源文件，例如css，js等，不需要输入html后缀
 * 为了可以手动修改后台地址，因此只能匹配到结尾路径，如/admin/login 只能匹配到/login或者/login?code=1
 * 内部自动返回后台一级目录
 * @param {objct} ctx 上下文对象
 */
function pathToArr(ctx){
  let staticReg = /(\/\w{1,})$|(\/\w{1,}\?{1}.*)$/;
  //匹配不带参数的网址
  let reg = /(?<=\/)[A-Za-z0-9]{1,}/g;
  return ctx.url.match(staticReg) ? ctx.url.match(reg) : [];

}

module.exports = router.routes();