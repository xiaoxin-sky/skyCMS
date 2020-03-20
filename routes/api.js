const router = require('koa-router')();
const tools = require('../model/tools');
router.get('*',async (ctx,next)=>{
    await next();
});
router.post('*',async (ctx,next)=>{
    
    await next();
});

router.use(async (ctx,next)=>{

    let pathArr = pathToArr(ctx);
    if(pathArr.length != 3 ) ctx.throw('api地址不正确');

    let method = pathArr.pop();
    let path = `/${pathArr.join('/')}`; //api控制器类的相对地址
    let absolutePath = await  tools.controllerExit(ctx,path).catch(()=>ctx.throw('api控制器不存在'));

    await require(absolutePath)(ctx,method);
    // next();
})


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