
/* router.post('/doLogin',async (ctx)=>{
  var userInfo = ctx.request.body;
  if(userInfo){
    ctx.session.userInfo = userInfo.username;
    ctx.redirect('/admin/index');
  }else{
    ctx.redirect('/admin/login');
  }
}); */
module.exports =function(ctx){
  ctx.render(ctx.url.substring(1),{
    code:ctx.pathParams.code
  });
}