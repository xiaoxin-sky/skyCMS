const puppeteer = require('puppeteer');

var fs = require("fs") ;

puppeteer.launch({dumpio:true,args: ['--no-sandbox', '--disable-setuid-sandbox'],timeout: 10000}).then(async browser => {

	/* fs.writeFile("chrome.txt",browser.wsEndpoint(),function (err) {
		
		if (err) throw err ;
		
		console.log("存入chrome.txt成功"); //文件被保存

	}) */
	const page = await browser.newPage();
	// await page.goto('http://sso.ipmph.com/login?ServiceID=examanswer2019&Referer=http%3A%2F%2Fexam.ipmph.com%2F');
	
	
	try {
        await page.goto('http://sso.ipmph.com/login?ServiceID=examanswer2019&Referer=http%3A%2F%2Fexam.ipmph.com%2F'); //到指定页面的网址.
        await page.waitFor(500);
    } catch (err) {
        await page.close();

        await browser.disconnect();

        console.log('出现错误：'+err); // 这里捕捉到错误 `error`
	}
	// const html = await page.$eval('#UserName', e => e.outerHTML);
	
	await page.type('#UserName', 'njwx154101304'); // 立即输入
	await page.type('#Password', 'cjx520940', {delay: 100}); // 输入变慢，像一个用户
	// console.log(username,password);
	let click = await page.click('#defaultLoginForm .zz-btn-a1 .zz-color input[type="button"]');
	console.log(click);
	
});