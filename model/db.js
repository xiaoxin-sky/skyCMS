const MongoClient = require('mongodb').MongoClient;
const config = require('./config');

class Db {
  static getInstrance(){
    if(!Db.instrance){
      Db.instrance = new Db();
      return Db.instrance;
    }else{
      return Db.instrance;
    }
  }
  constructor(){
    this.dbClient = '';
    this.connect();
  }
  connect(){
    return new Promise((resolve,reject)=>{
      if(this.dbClient!=''){
        resolve(this.dbClient);
      }else{
        let client = new MongoClient(config.url,{useNewUrlParser: true,useUnifiedTopology: true});
        client.connect(err=>{
          if(err){
            reject(err);
          }
          this.dbClient = client.db(config.dbName);
          resolve(this.dbClient);
        })
      }
    })
  }
  /**
   *  
   */
  find(collentionName,json,count=false){
    return new Promise(async (resolve,reject)=>{
      let connect = await this.connect();
      if(count){
        var resulte = connect.collection(collentionName).find(json).count();
        if(resulte.error)return reject(resulte.error);
        resolve(resulte);
      }else{
        var resulte = connect.collection(collentionName).find(json);
        resulte.toArray((err,docs)=>{
          if(err){
            return reject(err);
          }   
          resolve(docs);
        })
      }
      
      
    })
  }
  /**
   * 分页查找
   * @param {obj} collentionName 集合名字
   * @param {jsonObj} json 查询条件
   * @param {number} skipNum 跳过的个数
   * @param {number} initPaging 分页大小
   * @param {jsonObj} sort 排序方式
   */
  findPaging(collentionName,json={},skipNum=1,initPaging=5,sort){
    return new Promise(async (resolve,reject)=>{
      let connect = await this.connect();
      /* let skipNum = skipNum||0;//默认跳过数量
      let initPaging = initPaging||10;//默认分页数量 */
      // connect.collection(collentionName).deleteMany();
      skipNum = skipNum-1;
      if(sort){
        var resulte = connect.collection(collentionName).find(json).sort(sort).skip(skipNum*initPaging).limit(initPaging);
      }else{
        var resulte = connect.collection(collentionName).find(json).skip(skipNum).limit(initPaging);
      }
      resulte.toArray((err,docs)=>{
        if(err){
          return reject(err);
        }
        resolve(docs);
      })
    })
  }
  findCount(collentionName,query){
    return new Promise(async (resolve,reject)=>{
      let db = await this.connect();
      var resulte = db.runCommand({
        count:collentionName,
        query: query
      })
      if(resulte.error)reject(resulte.error);
      resolve(resulte);
    });
  }
  /**
   * 新增一条数据
   * @param {string} collentionName 集合名
   * @param {object} json 需要添加的内容
   */
  insert(collentionName,json){
    return new Promise(async (resolve,reject)=>{
      let db = await this.connect();
      json._id = await getNextSequenceValue(collentionName,db);
      let resulte = db.collection(collentionName).insertOne(json);
      if(resulte.error)reject(resulte.error);
      resolve(resulte);
      /* resulte.toArray((err,result)=>{
        if(err){
          return reject(err);
        }   
        resolve(result);
      }) */
    })
  }
  deleteMany(collentionName,json={}){
    return new Promise(async (resolve,reject)=>{
      let db = await this.connect();
      let res = db.collection(collentionName).deleteMany(json);
      if(res.error)reject(res.error);
      resolve(res);
    });
  }
  upDateupOne(collentionName,json){
    return new Promise(async (resolve,reject)=>{
      let db = await this.connect();
      let res = db.collection(collentionName).updateOne({'_id':json['_id']},{$set:json});
      if(res.error)reject(res.error);
      resolve(res);
    })
  }

}

function getNextSequenceValue(sequenceName,db){
  return new Promise(async (resolve,reject)=>{
    var sequenceDocument =await db.collection('counters').findOneAndUpdate(
      {'_id': sequenceName },
      {$inc:{'sequence_value':1}},
      { returnNewDocument: true }
    );
    if(sequenceDocument.error)reject(sequenceDocument.error);
    resolve(sequenceDocument.value.sequence_value);
  });
}

// setTimeout(()=>{
//   console.time('query2');
//   var db2 = Db.getInstrance();
//   console.log(db2);
//   (async ()=>{
//     var myda = await db2.find('user',{user_name:'13382011165'});
//     console.timeEnd('query2');
//   })();
// },1000)
// setTimeout(()=>{
//   console.time('querya');
//   var db3 = Db.getInstrance();
//   (async ()=>{
//     var myda = await db3.find('user',{user_name:'admin'});
//     console.timeEnd('querya');
//   })();
// },2000)

module.exports = Db.getInstrance();