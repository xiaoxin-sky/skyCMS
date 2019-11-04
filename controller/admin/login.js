var tools = require(process.cwd()+'/model/tools');
var db = require(process.cwd()+'/model/db');
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
      console.log('method不存在');
      await this.index(this.ctx);
    }
  }
  async index(ctx){
    if(ctx.query.loginout  == 'true'){
      ctx.session.userInfo = null ;
    }
    var templateExit = await tools.templateExit(ctx,ctx.url).catch(()=>ctx.render('404'));
    if(templateExit){
      ctx.render(tools.getTemplatePath(ctx.url),ctx.query);
    }
  }
  async doLogin(ctx){
    var userInfo = ctx.request.body;
    if(userInfo){
      var res = await db.find('user',{user_name:userInfo.username,password:userInfo.password});
      if(res.length>0){
        ctx.session.userInfo = res[0];
        ctx.redirect('/admin/login/reg');
      }else{
        ctx.redirect('/admin/login/index?code=0');
      }
    }else{
      ctx.redirect('/admin/login/index');
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