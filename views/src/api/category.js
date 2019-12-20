import request from '../utils/request';
//获取分类数据
/* export const getCategoryDataList = query => {
    return request({
        url: './category/getCategoryDataList',
        method: 'get',
        params: query
    });
};
 */
class Category{
    constructor(apiName,query){
        this.apiName = apiName;
        this.query = query;
    }
    getCategoryDataList(){
        return request({
            url: './category/getCategoryDataList',
            method: 'get',
            params: this.query
        });
    }
    /**
     * 添加一条一级分类
     */
    addCategoryTop(){
        return request({
            url: './category/addCategory',
            method: 'post',
            headers:{'Content-Type':"application/json"},
            data:this.query
        });
    }
    upDateCategory(){
        return request({
            url:'./category/upDateCategory',
            method:'post',
            headers:{'Content-Type':'application/json'},
            data:this.query
        })
    }
}
export default async function(apiName,query){
    let category = new Category(apiName,query);
    if(category.apiName){
        return await category[apiName]();
    }

}