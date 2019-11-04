const db = require(process.cwd()+'/model/db');

module.exports =async function(ctx){
  console.log(ctx.url+'------');
  var code = 0;
  var pageNum = ctx.pathParams.pageNum || 1;//页码数
  var singlePageQuantity = 5;//默认单页数量
  var categorysOne = await db.findPaging('categorys',{'father_id':0},pageNum,singlePageQuantity);//获取一级分类
  var categorysOneId  = categorysOne.map((value)=>{return (value = value._id)});
  var categorysTwo = await db.find('categorys',{'father_id':{$in:categorysOneId}});
  var categorys = getNewCategorys(categorysOne,categorysTwo);
  var pagelength = Math.ceil( (await db.find('categorys',{'father_id':0},true))/singlePageQuantity );
  // console.log(await db.find('categorys',{'father_id':0},true));
  if(JSON.stringify(ctx.pathParams) != '{}'){
    /* 后续增加参数是否为空的判断 */
    
    var doc = {
      'cate_name':ctx.pathParams.cate_name,
      'father_id':Number( ctx.pathParams.father_id ),
      'sort':ctx.pathParams.sort,
      'status':ctx.pathParams.status
    };
    var res = await insertCate();
    if(res){
      code = 1;
      categorys[categorys.length] = doc;
    }
  }
  // categorys = reorderCategorys(categorys);
  ctx.render(ctx.url.substring(1),{'next_sort':categorys.length,'categorys':categorys,'pagelength':pagelength,'pageNum':pageNum });
}
function insertCate(){
  var doc = {
    'cate_name':ctx.pathParams.cate_name,
    'father_id':Number( ctx.pathParams.father_id ),
    'sort':ctx.pathParams.sort,
    'status':ctx.pathParams.status
  };
  return db.insert('categorys',doc);
}
function reorderCategorys(data,arr=[],fid=0){
  if(!data){
    console.error('data参数不存在');
  }
  data.forEach((item)=>{
    if(item.father_id == fid){
      arr.push(item);
      reorderCategorys(data,arr,item._id);
    }
  });
  return arr;
}

function getNewCategorys(categorysOne,categorysTwo){
  var arr = new Array();
  categorysOne.forEach((item)=>{
    var temArr = [];
    temArr.push(item);
    arr[item._id] = temArr;
  })
  
  categorysTwo.forEach((item)=>{
    arr[item.father_id].push(item);
  })
  //去除空元素
  arr = arr.filter(()=>{return true;});
  //二维数组变一维数组
  arr = [].concat.apply([], arr);
  return arr;
}