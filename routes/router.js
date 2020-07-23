const Router = require("koa-router");
const router = new Router();
const tools = require(process.cwd()+'/model/tools');

router.get("(.*)", async (ctx, next) => await next());
router.post("(.*)", async (ctx, next) => await next());
// 下面的中间件作用：根据动态路由动态的的加载 controller
router.use("/:type/:controller/:method?", async (ctx, next) => {
  let { type, controller ,method} = ctx.params;
  try {
    let absolutePath = await tools.controllerExit(
      ctx,
      `/${type}/${controller}`
    );
    await require(absolutePath)(ctx,method);
  } catch (error) {
    console.log("全局捕获错误信息：" + error);

    let errStruct = {
      errCode: -20221,
      alert: "服务忙，请稍等(-20221)",
    };

    ctx.res.writeHead(200, {
      "content-Type": "application/json",
    });
    ctx.res.end(JSON.stringify(errStruct));
  }
});
module.exports = router;
