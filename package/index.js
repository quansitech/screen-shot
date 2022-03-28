const express = require('express')
const puppeteer = require('puppeteer')
const OSS = require('ali-oss');
const md5 = require('js-md5');

const app = express()

app.use(express.urlencoded({ extended: true }))

app.post('/', async function (req, res) {

    let { url, width, height, alioss_object_key } = req.body;

    if(!alioss_object_key){
        alioss_object_key = `screen-shot/${md5(JSON.stringify(req.body))}.png`;
    }

    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    page.setViewport({
        width: parseInt(width),
        height: parseInt(height)
    });
    await page.goto(url);
    const imgBuffer = await page.screenshot({fullPage: true });
    const store = new OSS({
        region: process.env.ALIOSS_REGION,
        accessKeyId: process.env.ALIOSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIOSS_ACCESS_KEY_SECRET,
        bucket: process.env.ALIOSS_BUCKET
     });
    const ossRes = await store.put(alioss_object_key, imgBuffer);
    await browser.close();

    res.send(ossRes)
})

app.listen(3000)