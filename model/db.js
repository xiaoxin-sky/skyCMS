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
      // if(this.dbClient!=''){
      //   resolve(this.dbClient);
      // }else{
        let client = new MongoClient(config.url,{useNewUrlParser: true,useUnifiedTopology: true});
        client.connect(err=>{
          if(err){
            reject(err);
          }
          this.dbClient = client.db(config.dbName);
          resolve(this.dbClient);
        })
      // }
    })
  }
  find(collentionName,json){
    return new Promise(async (resolve,reject)=>{
      let connect = await this.connect();
      let resulte = connect.collection(collentionName).find(json);
      resulte.toArray((err,docs)=>{
        if(err){
          return reject(err);
        }   
        resolve(docs);
      })
    })
  }
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