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
        let resulte = connect.collection(collentionName).find(json).count();
        if(resulte.error)return reject(resulte.error);
        resolve(resulte);
      }else{
        let resulte =await connect.collection(collentionName).find(json);
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
   * @param {number} skipNum 跳过的个数
   * @param {number} initPaging 分页大小
   * @param {Object} find 查询条件 两种形式 1：只查询，不排除，直接传查询条件  {  field1 ： < value > ， field2 ： < value >  ...  } ； 2：查询，并且需要排除返回字段，需要传数组对象，数组第一个是query对象，第二个是projection对象 [{  field1 ： < value > ， field2 ： < value >  ...  },{  field1 ： < value > ， field2 ： < value >  ...  }]
   * @param {jsonObj} sort 排序方式
   */
  findPaging(collentionName,skipNum=1,initPaging=5,find={},sort){
    return new Promise(async (resolve,reject)=>{
      let connect = await this.connect();
      /* let skipNum = skipNum||0;//默认跳过数量
      let initPaging = initPaging||10;//默认分页数量 */
      // connect.collection(collentionName).deleteMany();
      let count,resulte,query,projection;
      skipNum = skipNum-1;
      
      if(Array.isArray(find)){
        query = find[0] ;
        projection = find[1];
      }else{
        query = find;
        projection ={};
      }
      //这里有个坑，shell中的find需要个参数 query 和projection ，但是node中 find和project是分开的。
      if(sort){
        resulte = connect.collection(collentionName).find(query).project(projection).sort(sort).skip(skipNum*initPaging).limit(initPaging);
      }else{
        resulte = connect.collection(collentionName).find(query).project(projection).skip(skipNum).limit (Number(initPaging) );
      }
      count = await connect.collection(collentionName).find(query).count();
      
      resulte.toArray((err,docs)=>{
        if(err){
          return reject(err);
        }
        
        resolve({listData:docs,totalCount:count});
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
  /**
   * 更新一条数据，参数不传，默认更新全部数据，传递参数，则使用自定义更新,则需要手动写$set操作符
   * @param {string} collentionName 
   * @param {jsonObj} query 
   * @param {jsonObj} update 
   */
  upDateupOne(collentionName,query,update){
    return new Promise(async (resolve,reject)=>{
      let db = await this.connect();
      let res;
      if(update){
        res = db.collection(collentionName).updateOne({'_id':query['_id']},update);
      }else{
        res = db.collection(collentionName).updateOne({'_id':query['_id']},{$set:query});
      }
      if(res.error)reject(res.error);
      resolve(res);
    })
  }
  /**
   * 根据id 批量修改不同字段
   * @param {string} collentionName 
   * @param {json} query 查询条件
   * @param {object} json 批量修改的数据集合
   */
  upDateMany(collentionName,query={},json){
    return new Promise(async (resolve,reject)=>{
      let db = await this.connect();
      try {
        db.collection(collentionName).find(query).forEach(item=>{
          json.forEach(async data=> data._id == item._id && await db.collection(collentionName).updateOne({'_id':data._id},{$set:data}) );
        });
        resolve({ok:1});
      } catch (error) {
        reject(res.error)
      }
      
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