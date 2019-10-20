
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
  console.log(ctx.url.substring(1));
  if(ctx.pathParams.loginout  == 'true'){
    ctx.session.userInfo = null ;
  }
  ctx.render(ctx.url.substring(1),ctx.pathParams);
}