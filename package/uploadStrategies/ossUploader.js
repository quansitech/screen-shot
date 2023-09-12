const OSS = require('ali-oss');

async function uploadToOSS(key, file) {
    const store = new OSS({
        region: process.env.ALIOSS_REGION,
        accessKeyId: process.env.ALIOSS_ACCESS_KEY_ID,
        accessKeySecret: process.env.ALIOSS_ACCESS_KEY_SECRET,
        bucket: process.env.ALIOSS_BUCKET,
        secure: process.env.ALIOSS_SECURE
    });
    
    try {
        const res = await store.put(key, file);
        return res;
    } catch (error) {
        throw error;
    }
}

module.exports = uploadToOSS;