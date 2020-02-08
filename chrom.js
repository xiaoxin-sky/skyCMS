const puppeteer = require('puppeteer');

var fs = require("fs") ;

puppeteer.launch({dumpio:true,args: ['--no-sandbox', '--disable-setuid-sandbox'],timeout: 10000}).then(

	async browser => {

	fs.writeFile("chrome.txt",browser.wsEndpoint(),function (err) {
		
		if (err) throw err ;
		
		console.log("存入chrome.txt成功"); //文件被保存

    })
});