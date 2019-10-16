const db = require(process.cwd()+'/model/db');

module.exports =async (ctx)=>{
  var userInfo = ctx.request.body;
  if(userInfo){
      var res = await db.find('user',{user_name:userInfo.username,password:userInfo.password});
      if(res.length>0){
        ctx.session.userInfo = userInfo.username;
        ctx.redirect('/admin/index');
      }else{
        ctx.redirect('/admin/login?code=0','/admin/login');
      }
      
  }else{
    ctx.redirect('/admin/index');
  }
}