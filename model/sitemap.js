const fs = require('fs');
const { createReadStream, createWriteStream, copyFile, unlink, promises } = fs;
const fsPromises = promises;
const path = require('path');
const { Transform } = require('stream');
const { SitemapStream, XMLToSitemapItemStream } = require('sitemap'); // require('sitemap')
const { tmpdir } = require('os');
const smPath = path.resolve(process.cwd(), './public/sitemap.xml');
const tmpPath = path.resolve(tmpdir(), './sitemap.xml');

module.exports = async function updateSiteMap(data){
    let {url} = data;
    if(!url){   
       throw new Error('url is undefined');
    }
    try {
        await fsPromises.access(smPath, fs.constants.R_OK | fs.constants.W_OK);
    } catch (err) {
        //如果文件不存在，则新建文件并添加data
        return createSM( data);
    }
    await isAddURL(data) && addURL(data);
};
/**
 * 判断是否为新增地址 返回 true or false(如果不是新增，则内部已经实现自动更新URL)
 * @param {object} data 单条url对象
 */
function isAddURL(data) {
    return new Promise((resolve, reject) => {
        let isAdd = true;
        const smStream = new SitemapStream({
            lastmodDateOnly:true
        });
        const updateEntries = new Transform({
            objectMode: true,
            transform(chunk, encoding, callback) {
                // single hard-coded item example
                if (chunk.url === data.url) {
                    isAdd = false;
                    // replaces entry as it passes through the stream
                    callback(undefined, data);
                } else {
                    // not somethine we're looking to update
                    callback(undefined, chunk);
                }
            },
        });
        const pipeline = createReadStream(smPath)
            .pipe(new XMLToSitemapItemStream())
            .pipe(updateEntries)
            .pipe(smStream) // turns options back into xml
            .pipe(createWriteStream(tmpPath));
        pipeline.on('finish', () => {
            // overwrite original with temp file

            copyFile(tmpPath, smPath, error => {
                // delete temp file
                unlink(tmpPath, () => {
                    resolve(isAdd);
                });
            })
        });
        pipeline.on('error', e => e.code === 'EPIPE' || console.error(e));
    })
}
/**
 * 在sitemap.xml文件中新增一条url
 * @param {object} data 单条url对象
 */
function addURL(data) {
    const smStream = new SitemapStream({
        lastmodDateOnly:true
    });
    smStream.write(data);
    const pipeline = createReadStream(smPath)
        .pipe(new XMLToSitemapItemStream())
        .pipe(smStream) // turns options back into xml
        .pipe(createWriteStream(tmpPath));
    pipeline.on('finish', () => {
        copyFile(tmpPath, smPath, error => {
            unlink(tmpPath, () => {

            });
        })
    });
    pipeline.on('error', e => e.code === 'EPIPE' || console.error(e));
}
/**
 * 创建sitemap.xml文件并新增一条url
 * @param {object} data 单条url对象
 */
function createSM(data) {
    const sitemap = new SitemapStream({
        lastmodDateOnly:true
    });
    const writeStream = createWriteStream(smPath);
    sitemap.pipe(writeStream);
    sitemap.write(data);
    sitemap.end();
}
