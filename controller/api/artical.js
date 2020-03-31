const db = require(process.cwd()+'/model/db');
class Artical {
  constructor(ctx,method){
    this.ctx = ctx;
    this.method = method;
  }
  async init(){
    
    if(this[this.method]){
        await this[this.method]();
    }else{
        console.log(this.ctx.url+'api不存在');
        this.ctx.body = {'code':201,'msg':'接口不存在'};
    }
  }
  async getArticalList(){
      let queryParams = this.ctx.query;
      
      let skipNum,initPaging,category,ret;
      skipNum = queryParams.skipNum || 1 ;
      initPaging = Number(queryParams.initPaging) || 8;
      category = queryParams.category ;
      if(category == 'index'){
        //分开写是因为搜索的时候如是首页，则不需要分类
         ret = await db.findPaging('articals',skipNum,initPaging,[{ status:{$in:[true]}},{content:0,markdownContent:0 }],{'_id':-1}  );
      }else{
         ret = await db.findPaging('articals',skipNum,initPaging,[{ status:{$in:[true]},cate_path:{$in:[category]}} ,{content:0,markdownContent:0 }],{'_id':-1}  );
      }
      if(ret){
        this.ctx.body = {'code':200,'data':ret};
      }else{
        this.ctx.body = {'code':204,'msg':'数据获取失败'};
      }
  }
  async getArticalDetails(){
    let artId = this.ctx.query.id;
    
    if(artId){
      //每次访问文章的时候，增加一次浏览量
      await db.upDateupOne('articals',{'_id':Number( artId )},{$inc:{views:1}});
      
      let artData =await db.find('articals',{_id:Number( artId )});
      if(artData){
        this.ctx.body = {'code':200,'data':artData};
      }else{
        this.ctx.body = {'code':204,'msg':'数据获取失败'};
      }
    }else{
      this.ctx.body = {'code':204,'msg':'文章不存在'};
    }
  }
  //文章点赞数量增加
  async addLick(){
    let artId = this.ctx.request.body.id;
    if(!artId)this.ctx.body = {'code':204,'msg':'文章参数不正确'};
    let lickedArtIds = this.ctx.cookies.get('lickedArtIds') || '';
    lickedArtIds = lickedArtIds.split(',');
    if(lickedArtIds.indexOf(`${artId}`) == -1){
        let ret =  await db.upDateupOne('articals',{'_id':Number( artId )},{$inc:{like:1}});
        if(ret.result.ok === 1){
            lickedArtIds.push(artId);
            lickedArtIds = lickedArtIds.toString();
            this.ctx.cookies.set( 'lickedArtIds', lickedArtIds , {  maxAge:1000*86400*30 });
            this.ctx.body = {'code':200,'msg':'success'};
        }else{
          this.ctx.body = {'code':204,'msg':'error'};
      }
    }else{
      this.ctx.body = {'code':201,'msg':'liked'};
    }
    
  }
}

module.exports = async (ctx,method)=>{
  let artical = new Artical(ctx,method);
  await artical.init();//注意：此处是异步的，需要用await，否则this.ctx.body失效。返回404；
  
}