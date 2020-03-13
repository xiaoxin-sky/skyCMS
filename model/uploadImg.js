const path = require('path');
const fs = require('fs');


module.exports = (ctx) => {
    /* 后续图片类型需要做区分 */
    // console.log(ctx.request.files['file']);
    let file = ctx.request.files['file'];
    let tmpFilePath = file.path;
    let fileName = file.name;
    let uploadPath =  process.cwd() + '/public/upload/images/';
    return new Promise((resolve,reject)=>{
        fs.access(uploadPath, fs.constants.F_OK, async (err) => {
            if (err) {
                fs.mkdir(uploadPath, { recursive: true }, async (err) => {
                    if (err) throw reject(err);
                    let res = await rename(tmpFilePath,uploadPath,fileName);
                    resolve(res);
                     
                });
            } else {
                let res = await rename(tmpFilePath,uploadPath,fileName);
                resolve(res);
            }
        });
    })
    


}
/**
 * 
 * @param {string} uploadPath 需要移动的文件夹目录
 * @param {string} fileName 文件名
 */
function rename(tmpFilePath,uploadPath,fileName) {
    /* 后续优化 remoteFileName  需要md5加密一下 */
    let remoteFileName = (new Date()).getTime() + fileName;
    let newPath = uploadPath + remoteFileName;
    return new Promise((resolve,reject)=>{
        fs.rename(tmpFilePath, newPath, (err) => {
            if (err) reject(false);
            resolve(`/upload/images/${remoteFileName}`);
        });
    })
    
}