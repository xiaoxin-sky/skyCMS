var tools = require(process.cwd()+'/model/tools');
var db = require(process.cwd()+'/model/db');
class Index  {
  //constructor用于每次执行时候过滤东西
  constructor(ctx,method){
    this.ctx = ctx;
    this.method = method;
  }
  async init(){
    if(this.method){
      await this[this.method](this.ctx);
    }else{
      console.log(this.ctx.url);
      await this.ctx.redirect('/admin/login/index');
    }
  }
  async index(ctx){
    if(ctx.query.loginout  == 'true'){
      ctx.session.userInfo = null ;
    }
    var templateExit = await tools.templateExit(ctx,ctx.url).catch(()=>ctx.render('404'));
    if(templateExit){
      ctx.render(tools.getTemplatePath(ctx.url),ctx.query);
    }else{
      ctx.redirect(`${ctx.url}/index`);
    }
  }
  async home(ctx){
    
     console.log(tools.getTemplatePath(ctx.url)+'-------');
    await ctx.render(tools.getTemplatePath(ctx.url));
  }
   welcome(ctx){
    ctx.render(tools.getTemplatePath(ctx.url),ctx.query);
  }
}

module.exports =async (ctx,method)=>{
  var login = new Index(ctx,method);
  await login.init();
};