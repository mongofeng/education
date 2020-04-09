/* 2.然后创建 src/setupProxy.js 并写入一下转发规则 */
const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function (app) {
    app.use(createProxyMiddleware('/v2', {
        target: 'http://127.0.0.1:8110/',
        pathRewrite: {
            "^/v2": "/"
        }
    }));


    // app.use(createProxyMiddleware('/wechatServer', {
    //     target: 'http://127.0.0.1:8110/',
    //     pathRewrite: {
    //         "^/wechatServer": "/wechat"
    //     }
    // }));
};