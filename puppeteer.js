const Koa = require('koa');
const fs = require('fs');
const puppeteer = require('puppeteer');
const browserUrl = fs.readFileSync("chrome.txt","utf8");

const app = new Koa();

app.use(async (ctx,next)=>{
    console.log(ctx.url);
    const browser = await puppeteer.connect({browserWSEndpoint:browserUrl});
    const page = await browser.newPage();
    try {
        await page.goto(ctx.url); //到指定页面的网址.
        await page.waitFor(500);
    } catch (err) {
        await page.close();

        await browser.disconnect();

        console.log('出现错误：'+err); // 这里捕捉到错误 `error`
    }
    let content = await page.content();
    ctx.body = content;
    await page.close();
    await browser.disconnect();
})

app.listen('3388');
console.log('3388端口爬虫代理程序已启动');
