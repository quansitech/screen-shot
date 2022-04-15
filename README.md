## 截图服务

截图微服务程序，docker快速安装，通过http请求的方式发起截图请求，返回截图成功后的url地址。

目前仅支持将截图结果上传到alioss



### docker安装

```docker
docker-compose up -d screen-shot
```



### 配置

docker-compose环境变量设置

```shell
ALIOSS_REGION=
ALIOSS_ACCESS_KEY_ID=
ALIOSS_ACCESS_KEY_SECRET=
ALIOSS_BUCKET=
ALIOSS_SECURE=
```

ALIOSS_SECURE设置true返回https, false返回http

其余配置参考alioss配置 [链接](https://github.com/ali-sdk/ali-oss#node-usage)





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
| alioss_object_key | string | 否   | alioss的object地址，不填则会根据请求的参数计算唯一hash，将hash值作为object地址 |


