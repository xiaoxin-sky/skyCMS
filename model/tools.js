var fs = require('fs');

class Tools {
  constructor(){

  }
  templateExit(ctx,path){
    return new Promise((resolve,reject)=>{
      fs.access(this.getTemplatePath(path), fs.constants.F_OK, (err) => {
        if(err){
          console.log(this.getTemplatePath(path)+'模板文件不存在');
          reject(err);
        } 
        resolve(true);
      });
    });
  }
  /**
   * 检测控制器类文件是否存在，存在返回物理绝对路径，否则直接抛出错误
   * @param {Object} ctx 上下文对象 
   * @param {*} path 控制器类文件相对地址
   */
  controllerExit(ctx,path){
    return new Promise((resolve,reject)=>{
      let absolutePath = this.getControllerPath(path) ;
      fs.access(absolutePath, fs.constants.F_OK, (err) => {
        if(err){
          console.log(this.getControllerPath(path)+'控制器文件不存在');
          reject(err);
        } 
        resolve(absolutePath);
      });
    });
  }
  /**
   * 相对路径转换为控制器绝对路径
   * @param {string} path 相对路径参数
   */
  getControllerPath(path){
    //匹配类似/admin/login/index
    let reg = /(?<=\/)[A-Za-z0-9]{1,}/g;
    path = path.match(reg).join('/');
    return (process.cwd()+'/controller/'+path+'.js');
  }
  /**
   * 获取模板绝对路径
   * @param {string} path 相对路径参数
   */
  getTemplatePath(path){
    //匹配类似/admin/login/index
    let reg = /(?<=\/)[A-Za-z0-9]{1,}/g;
    path = path.match(reg).join('/');
    return (process.cwd()+'/views/'+path+'.html');
  }
  /**
   * 获取当前执行文件的相对目录
   */
  getFatherPath(){
    return __dirname.replace(process.cwd(),'');
  }
}

module.exports = new Tools();