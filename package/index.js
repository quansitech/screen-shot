const express = require('express')
const puppeteer = require('puppeteer')
const md5 = require('js-md5');
const uploadStrategies = require('./uploadStrategies');

const app = express()

app.use(express.urlencoded({ extended: true }))

app.post('/', async function (req, res) {

    let { url, width, height, object_key, waitForTimeout } = req.body;

    if(!object_key){
        object_key = `screen-shot/${md5(JSON.stringify(req.body))}.png`;
    }

    const uploadMethod = uploadStrategies[process.env.UPLOAD_TYPE];

    let ossRes;
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    try{
        const page = await browser.newPage();
        page.setViewport({
            width: parseInt(width),
            height: parseInt(height)
        });
        await page.goto(url);
        if(!!waitForTimeout){
            await page.waitForTimeout(waitForTimeout);
        }
        const imgBuffer = await page.screenshot({fullPage: true });
        ossRes = await uploadMethod(object_key, imgBuffer);
        await browser.close();
    }
    catch(e){
        await browser.close();
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