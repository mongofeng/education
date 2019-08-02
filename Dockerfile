FROM node:10.13-alpine
# https://github.com/vuejs/vue-cli/issues/2404
WORKDIR /usr/src/app
# ENV NODE_ENV production 以production的环境安装依赖
COPY ["package.json", "package-lock.json*", ".npmrc", "./"]
RUN ls -a
RUN npm install
COPY . .
RUN ls -a
CMD ["npm", "run", "build"]
