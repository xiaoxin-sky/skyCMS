const router = require('koa-router')();
const fs = require('fs');

/* router.use(async (ctx)=>{
  var fileExit = await readFile(process.cwd()+'/views'+ctx.url+'.html');
  // console.log(data);
  if(fileExit){
    ctx.render(ctx.url.substring(1));
  }
}); */
router.get('*',async (ctx,next)=>{
  /* 
    使用正则匹配到过滤掉静态资源文件，例如css，js等，只处理html模板文件 
    此处只能匹配到结尾路径，如/admin/login 只能匹配到/login
  */
  let reg = /(\/\w{1,})$|(\/\w{1,}\?{1}.*)$/;
  // console.log(ctx.url.match(reg));
  if( ctx.url.match(reg) ){
    var fileExit = await readFile(process.cwd()+'/views'+ctx.url+'.html');
    if(fileExit){
      ctx.render(ctx.url.substring(1));/* 截取ctx.url中的第一个斜杠 */
    }
  }else{
    await next();
  }
  
 
});
function readFile(path){
  return new Promise((resolve,reject)=>{
    fs.access(path, fs.constants.F_OK, (err) => {
      if(err) reject(false);
      resolve(true);
    });
  });
}

module.exports =  router.routes();