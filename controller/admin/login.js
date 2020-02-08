const tools = require(process.cwd()+'/model/tools');
const db = require(process.cwd()+'/model/db');
const tokenSecret = require(process.cwd()+'/model/config').tokenSecret;
const jwt = require('jsonwebtoken');
class Login  {
  //constructor用于每次执行时候过滤东西
  constructor(ctx,method){
    this.ctx = ctx;
    this.method = method;
  }
  async init(){
    if(this.method){
      await this[this.method](this.ctx);
    }else{
      await this.ctx.redirect(this.ctx.url);
    }
  }
  async index(ctx){
    console.log('jinlaile');
    // if(ctx.query.loginout  == 'true'){
    //   ctx.session.userInfo = null ;
    // }
    // var templateExit = await tools.templateExit(ctx,ctx.url).catch(()=>ctx.render('404'));
    // if(templateExit){
    //   ctx.render(tools.getTemplatePath(ctx.url),ctx.query);
    // }else{
    //   ctx.redirect(`${ctx.url}/index`);
    // }
  }
  async dologin(ctx){
    var userInfo = ctx.request.query;
    
    if(userInfo){
      var res = await db.find('user',{user_name:userInfo.username,password:userInfo.password});
      if(res.length>0){
        const token = jwt.sign({iss:'skyCms',user_name:userInfo.username},tokenSecret,{expiresIn:'5h'});
        ctx.body = {'code':1,'msg':'登录成功','token':token};
      }else{
        ctx.body = {'code':0,'msg':'账号或者密码错误'};
      }
    }else{
      ctx.body = {'code':0,'msg':'请输入用户名和密码'};
    }
  }
  reg(){
    console.log('这是注册方法');
  }
}

module.exports =async (ctx,method)=>{
  var login = new Login(ctx,method);
  await login.init();
};