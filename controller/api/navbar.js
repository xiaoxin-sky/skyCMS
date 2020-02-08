const db = require(process.cwd()+'/model/db');

class Navbar {
  constructor(ctx,method){
    this.ctx = ctx;
    this.method = method;
  }
  //功能：对于执行的方法进行过滤
  async init(){
    
    if(this[this.method]){
        await this[this.method]();
    }else{
        console.log(this.ctx.url+'api不存在');
        this.ctx.body = {'code':201,'msg':'接口不存在'};
    }
  }
  async getNavList(){
    let ret = await db.find('categorys',{});
    if(ret){
      this.ctx.body = {'code':200,'data':ret};
    }else{
      this.ctx.body = {'code':204,'msg':'数据获取失败'};
    }
  }
}

module.exports = async (ctx,method)=>{
  let artical = new Navbar(ctx,method);
  await artical.init();//注意：此处是异步的，需要用await，否则this.ctx.body失效。返回404；
  
}