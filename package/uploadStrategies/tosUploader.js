const { TosClient } = require('@volcengine/tos-sdk');

const protocol = process.env.TOS_SECURE ? 'https' : 'http';

async function uploadToTOS(key, file) {
    const store = new TosClient({
        region: process.env.TOS_REGION,
        accessKeyId: process.env.TOS_ACCESS_KEY_ID,
        accessKeySecret: process.env.TOS_ACCESS_KEY_SECRET,
        endpoint: process.env.TOS_ENDPOINT,
    });

    try {
        const response = await store.putObject({
            key: key,
            bucket: process.env.TOS_BUCKET,
            body: file,
        });

        if (response.statusCode === 200) {
            const url = `${protocol}://${process.env.TOS_BUCKET}.${process.env.TOS_ENDPOINT}/${key}`;
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

module.exports = uploadToTOS;