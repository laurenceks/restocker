const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    app.use(
        '/php',
        createProxyMiddleware({
            target: 'http://localhost:80',
            changeOrigin: true,
            secure: false,
            pathRewrite: {
                '^/php': 'Projects/Restocker/public/php'
            }
        })
    );
};