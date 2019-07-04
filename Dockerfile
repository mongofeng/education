FROM node:10.13-alpine
# https://github.com/vuejs/vue-cli/issues/2404
WORKDIR /usr/src/app
# ENV NODE_ENV production 以production的环境安装依赖
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --registry=https://registry.npm.taobao.org  --sass_binary_site=https://npm.taobao.org/mirrors/node-sass/
COPY . .
RUN ls
CMD ["npm", "run", "build"]