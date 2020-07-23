const router = require('koa-router')();
const admin_main = require('./backend');
const api = require('./api');
router.use('/api', api);//前台api接口
router.use('/admin', admin_main);//后台api接口
module.exports = router;