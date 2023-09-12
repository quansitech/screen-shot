## 截图服务

截图微服务程序，docker快速安装，通过http请求的方式发起截图请求，返回截图成功后的url地址。

目前仅支持将截图结果上传到alioss



### docker安装

```docker
docker-compose up -d screen-shot
```



### 配置

docker-compose alioss环境变量设置

```shell
UPLOAD_TYPE=oss
ALIOSS_REGION=
ALIOSS_ACCESS_KEY_ID=
ALIOSS_ACCESS_KEY_SECRET=
ALIOSS_BUCKET=
ALIOSS_SECURE=
ALIOSS_ENDPOINT=
ALIOSS_CNAME=false
```

ALIOSS_SECURE设置true返回https, false返回http

ALIOSS_ENDPOINT非必填（不填则返回链接：桶名+endpoint+文件路径）

ALIOSS_CNAME设置true则ALIOSS_ENDPOINT就是自定义域名的链接(如:endpoint+文件路径)

其余配置参考alioss配置 [链接](https://github.com/ali-sdk/ali-oss#node-usage)

docker-compose tos环境变量设置

```shell
UPLOAD_TYPE=tos
TOS_REGION=
TOS_ACCESS_KEY_ID=
TOS_ACCESS_KEY_SECRET=
TOS_BUCKET=
TOS_SECURE=
TOS_ENDPOINT=
TOS_CNAME=false
```
TOS_SECURE设置true返回https, false返回http

TOS_ENDPOINT为必填 可参考[链接](https://www.volcengine.com/docs/6349/107356)

TOS_CNAME默认值为false，TOS_CNAME设置true则返回链接：endpoint+文件路径，需要在火山引擎后台配置自定义域名，可参考[链接](https://www.volcengine.com/docs/6349/128983)

其余配置参考tos配置 [链接](https://www.volcengine.com/docs/6349/74822)


### 用法

服务默认采用3000端口

docker间的访问可以直接采用 http://screen-shot:3000 地址访问

```shell
curl --request POST 'http://screen-shot:3000' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'url=https://www.quansitech.com' \
--data-urlencode 'width=1920' \
--data-urlencode 'height=1358'
```

请求参数说明

| 参数                | 类型     | 必填  | 说明                                                   |
| ----------------- | ------ | --- | ---------------------------------------------------- |
| url               | string | 是   | 需要截图的url                                             |
| width             | int    | 是   | 图片宽度                                                 |
| height            | int    | 是   | 图片高度                                                 |
| object_key        | string | 否   | 文件的object地址，不填则会根据请求的参数计算唯一hash，将hash值作为object地址 |
| waitForTimeout    | int    | 否   | 等待N毫秒后再截图                                         |


