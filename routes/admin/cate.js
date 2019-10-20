let db = require(process.cwd()+'/model/db');

module.exports =async function(ctx){
  console.log(ctx.url);
  var code = 0;
  var categorys = await db.find('categorys');
  console.log(categorys);
  if(JSON.stringify(ctx.pathParams) != '{}'){
    /* 后续增加参数是否为空的判断 */
    var doc = {
      'cate_name':ctx.pathParams.cate_name,
      'cate_id':ctx.pathParams.cate_id,
      'father_id':ctx.pathParams.father_id,
      'sort':ctx.pathParams.sort
    };
    var res = await db.insert('categorys',doc);
    if(res){
      code = 1;
      categorys[categorys.length] = doc;
    }
  }
  
  ctx.render(ctx.url.substring(1),{'next_sort':categorys.length,'categorys':categorys});
}