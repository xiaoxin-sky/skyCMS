var router = require('koa-router')();
var admin_main = require('./admin/main');

router.use('/admin',admin_main);

module.exports = router;