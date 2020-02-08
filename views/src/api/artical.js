import request from '../utils/request';
class Artical{
    constructor(apiName,query){
        this.apiName = apiName;
        this.query = query;
    }
    /**
     * 添加文章
     */
    addArtical(){
        return request({
            url: './artical/addArtical',
            method: 'post',
            headers:{'Content-Type':"application/json"},
            data:this.query
        });
    }
    getArtical(){
        console.log(this.query);
        
        return request({
            url: './artical/getArtical',
            method: 'get',
            headers:{'Content-Type':"application/json"},
            params:this.query
        });
    }
    upDateArtical(){
        return request({
            url: './artical/upDateArtical',
            method: 'post',
            // headers:{'Content-Type':"application/json"},
            data:this.query
        });
    }
    delArtical(){
        return request({
            url: './artical/delArtical',
            method: 'post',
            // headers:{'Content-Type':"application/json"},
            data:this.query
        });
    }
}
export default async function(apiName,query){
    let artical = new Artical(apiName,query);
    if(artical.apiName){
        return await artical[apiName]();
    }

}