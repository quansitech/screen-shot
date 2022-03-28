FROM node:14.19.1-buster

ARG UBUNTU_SOURCE=aliyun
COPY ./sources.sh /tmp/sources.sh

COPY ./fonts /usr/local/share/fonts

RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 3B4FE6ACC0B21F32
    
RUN sed -i 's/deb.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list; \
    sed -i 's/security.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list; \
    sed -i 's/security-cdn.debian.org/mirrors.tuna.tsinghua.edu.cn/' /etc/apt/sources.list; \
    chmod +x /tmp/sources.sh; \
    /bin/sh -c /tmp/sources.sh; \
    rm -rf /tmp/sources.sh

RUN apt-get update && apt-get -y install  ca-certificates fonts-liberation \
libappindicator3-1 libasound2 libatk-bridge2.0-0 libatk1.0-0 libc6 libcairo2 \
libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgbm1 libgcc1 libglib2.0-0 libgtk-3-0 \
libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 \
libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 \
libxrender1 libxss1 libxtst6 lsb-release wget xdg-utils

COPY ./package /var/www/package

WORKDIR /var/www/package

RUN yarn install

ENTRYPOINT ["node", "/var/www/package/index.js"]