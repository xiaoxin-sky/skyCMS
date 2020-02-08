let db = require(process.cwd()+'/model/db');
let jwt = require('jsonwebtoken');
let tokenSecret = require(process.cwd()+'/model/config').tokenSecret;


class Category {
    constructor(ctx,method){
        this.ctx = ctx;
        this.method = method;
    }
    async init(){
        if(this.method){
            await this[this.method](this.ctx);
        }else{
            console.log(this.ctx.url);
            await this.ctx.redirect('/admin/category/getCategoryDataList');
        }
    }
    async getCategoryDataList(ctx){
        let categoryData = await db.find('categorys');
        
        ctx.body = {code:'1','categoryData':categoryData};
        
        
    }
    /**
     * 清空所有分类数据
     * @param {object} ctx 
     */
    async deleteMany(ctx){
        let res = await db.deleteMany('categorys');
        console.log(res);
    }
    /**
     * 添加一条一级分类
     * @param {object}} ctx 
     */
    async addCategory(ctx){
        let insertData = ctx.request.body;
        let ret = await db.insert('categorys',insertData);
        if(ret.result.ok==1){
            ctx.body = {'code':1,'msg':'添加成功','insertedId':ret.insertedId};
        }else{
            ctx.body = {'code':0,'msg':'添加失败'};
        }
    }
    async upDateCategory(ctx){
        let data = ctx.request.body;
        console.log(data);
        let ret = await db.upDateupOne('categorys',data);
        if(ret.result.ok==1){
            ctx.body = {'code':1,'msg':'修改成功'};
        }else{
            ctx.body = {'code':0,'msg':'修改失败'};
        }
    }
    async delTopCategory(ctx){
        let data = ctx.request.body;
        let ret = await db.deleteMany('categorys',data);
        if(ret.result.ok==1){
            ctx.body = {'code':1,'msg':'删除成功'};
        }else{
            ctx.body = {'code':0,'msg':'删除失败'};
        }
    }
}

module.exports =async (ctx,method)=>{
    let category = new Category(ctx,method);
    await category.init();
};