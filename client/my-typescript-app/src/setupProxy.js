// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.sportmonks.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Réécrire le chemin pour supprimer /api
      },
    })
  );
};
