const express = require('express')
const puppeteer = require('puppeteer')
const OSS = require('ali-oss');
const md5 = require('js-md5');
const { TosClient, TosClientError, TosServerError } = require('@volcengine/tos-sdk');
const secure = process.env.ALIOSS_SECURE || process.env.TOS_SECURE || false;
const protocol = secure ? 'https' : 'http';
const UploadStream = {
    'oss': async function(key,file){
        let res;
        const store = new OSS({
            region: process.env.ALIOSS_REGION,
            accessKeyId: process.env.ALIOSS_ACCESS_KEY_ID,
            accessKeySecret: process.env.ALIOSS_ACCESS_KEY_SECRET,
            bucket: process.env.ALIOSS_BUCKET,
            secure: process.env.ALIOSS_SECURE
         });
         res = await store.put(key, file);
         return res;
    },
    'tos':async function(key,file){
        const store = new TosClient({
            region: process.env.TOS_REGION,
            accessKeyId: process.env.TOS_ACCESS_KEY_ID,
            accessKeySecret: process.env.TOS_ACCESS_KEY_SECRET,
            endpoint: process.env.TOS_ENDPOINT,
        })
        try {
            const response = await store.putObject({
                key: key,
                bucket: process.env.TOS_BUCKET,
                body: file,
            });
            
            if (response.statusCode === 200) {
                const url = `${protocol}://${process.env.TOS_BUCKET}.${process.env.TOS_ENDPOINT}/${key}`
                return {
                    name: key,
                    url: url
                };
            } else {
                throw new Error('TOS上传失败');
            }
        } catch (error) {
            throw error; 
        }
    }
}


const UploadMethod = function(type,key,file){
    return UploadStream[type](key,file);
}
const app = express()

app.use(express.urlencoded({ extended: true }))

app.post('/', async function (req, res) {

    let { url, width, height, object_key, waitForTimeout } = req.body;

    if(!object_key){
        object_key = `screen-shot/${md5(JSON.stringify(req.body))}.png`;
    }

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
        ossRes = await UploadMethod(process.env.UPLOAD_TYPE, object_key, imgBuffer);
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