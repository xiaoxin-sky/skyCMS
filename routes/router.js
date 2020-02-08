var router = require('koa-router')();
var admin_main = require('./backend');
var api = require('./api');

router.use('/api',api);//前台api接口
router.use('/admin',admin_main);//后台api接口

module.exports = router;