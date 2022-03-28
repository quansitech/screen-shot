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
```

参考alioss配置 [链接](https://github.com/ali-sdk/ali-oss#node-usage)



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


