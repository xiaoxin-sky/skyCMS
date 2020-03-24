const 
    request = require('supertest'),
    app = require('../app');
describe('#test app',function(){
    let server = app.listen(9900);
    describe('#test server',function(){
        it('#test GET /api',async ()=>{
           await request(server).get('/api').expect(200,{"code":201,"msg":"接口不存在"});
        });
        it('#test GET /api/sdd',async ()=>{
            await request(server).get('/api/sdd').expect(200,{"code":201,"msg":"接口不存在"});
        })
    })
})