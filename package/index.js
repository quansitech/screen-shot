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

    let ossRes;
    try{
        const browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        page.setViewport({
            width: parseInt(width),
            height: parseInt(height)
        });
        await page.goto(url);
        await page.waitForTimeout(3000);
        const imgBuffer = await page.screenshot({fullPage: true });
        const store = new OSS({
            region: process.env.ALIOSS_REGION,
            accessKeyId: process.env.ALIOSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.ALIOSS_ACCESS_KEY_SECRET,
            bucket: process.env.ALIOSS_BUCKET,
            secure: process.env.ALIOSS_SECURE
         });
        ossRes = await store.put(alioss_object_key, imgBuffer);
        await browser.close();
    }
    catch(e){
        console.log(e);
        res.send({
            code: -1,
            msg: e.message
        });
        return;
    }
    

    res.send(ossRes)
})

app.listen(3000)