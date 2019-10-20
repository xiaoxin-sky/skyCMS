module.exports =function(ctx){
  ctx.render(ctx.url.substring(1),ctx.session.userInfo);
}