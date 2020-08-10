/* 2.然后创建 src/setupProxy.js 并写入一下转发规则 */
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    console.log(process.env)
    app.use(createProxyMiddleware('/v2', {
        target: 'http://localhost:8110/',
        pathRewrite: {
            "^/v2": "/"
        }
    }));


    app.use(createProxyMiddleware('/wechatV2', {
        target: 'http://localhost:8110/',
        pathRewrite: {
            "^/wechatV2": "/wechat"
        }
    }));
};