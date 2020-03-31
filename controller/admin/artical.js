let rootPath = process.cwd();
let db = require(rootPath+'/model/db');
let jwt = require('jsonwebtoken');
let tokenSecret = require(rootPath+'/model/config').tokenSecret;
let uploadImg = require(rootPath+'/model/uploadImg');
let updateSiteMap = require(rootPath+'/model/sitemap');
let moment = require('moment');
class Artical {
    constructor(ctx,method){
        this.ctx = ctx;
        this.method = method;
    }
    async init(){
        if(this[this.method]){
            await this[this.method](this.ctx);
        }else{
            console.log(this.ctx.url+'api不存在');
            his.ctx.body = {'code':201,'msg':'接口不存在'};
            
        }
    }
    /**
     * 添加一篇文章
     * @param {object}} ctx 
     */
    async addArtical(ctx){
        let insertData = ctx.request.body;
        let token = ctx.request.headers['authorization'].split(' ')[1];
        let decodedRes = await jwt.verify(token,tokenSecret);
        let __HOST__ = ctx.state.__HOST__;
        insertData.user_name = decodedRes.user_name;
        
        let ret = await db.insert('articals',insertData);
        let insertedId = ret.insertedId;
        if(ret.result.ok==1){
            updateSiteMap({
                url:`${__HOST__}/${insertData.cate_path}/${insertedId}`,
                lastmod:moment(new Date().toLocalDateString).format('YYYY-MM-DD'),
                changefreq:'monthly',
                priority:0.6,
            });
            ctx.body = {'code':1,'msg':'添加成功'};
        }else{
            ctx.body = {'code':0,'msg':'添加失败'};
        }
    }
    /**
     * 获取文章 get请求
     * @param {object}} ctx 
     * -------------------------------
     * 以下参数是要求前端传过来的查询条件。包含在query里面。findPaging需要的参数以此是
     * @param {number} skipNum 跳过的个数
     * @param {number} initPaging 分页大小
     * @param {jsonObj} json 查询条件
     * @param {jsonObj} sort 排序方式
     */
    async getArtical(ctx){
        let queryParams = ctx.query;
        
        // let queryParams = this.ctx.query;
        let skipNum,initPaging;
        skipNum = queryParams.skipNum || 1 ;
        initPaging = Number(queryParams.initPaging) || 8;
        let ret = await db.findPaging('articals',skipNum,initPaging,{},{'_id':-1});
        if(ret){
            ctx.body = {'code':1,'listData':ret.listData,'totalCount':ret.totalCount};
        }else{
            ctx.body = {'code':0,'msg':'获取失败'};
        }
    }
    async upDateArtical(ctx){
        let query = ctx.request.body;
        let ret;
        if( Array.isArray( query ) ){
            let tmpIdArr = [];
            query.forEach(item=>tmpIdArr.push(item._id));
            let filter = {'_id':{$in:tmpIdArr}};
            ret = await db.upDateMany('articals',filter,query);
        }else{
            //这里只做了markdown 提交的修改的 sitemap变更。
            updateSiteMap({
                url:`${__HOST__}/${query.cate_path}/${query._id}`,
                lastmod:moment(new Date().toLocalDateString).format('YYYY-MM-DD'),
                changefreq:'monthly',
                priority:0.6,
            });
            ret = await db.upDateupOne('articals',query)
        }
        if(ret){
            
            ctx.body = {'code':1,'msg':'修改成功'};
        }else{
            ctx.body = {'code':0,'msg':'修改失败'};
        }
        
    }
    async delArtical(ctx){
        let query = ctx.request.body;
        let ret = await db.deleteMany('articals',{_id:{$in:query}});
        if(ret){
            ctx.body = {'code':1,'msg':'删除成功'};
        }else{
            ctx.body = {'code':0,'msg':'删除失败'};
        }
        
    }
    async uploadImg(ctx){
        let imgUrl = await uploadImg(ctx);
        ctx.status = 200;
        ctx.body = {'code':1,imgUrl:ctx.state.__HOST__+imgUrl};
        
    }
}

module.exports =async (ctx,method)=>{
    let category = new Artical(ctx,method);
    await category.init();
};