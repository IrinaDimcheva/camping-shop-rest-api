// const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const { auth } = require('../utils');
const cookieSecret = process.env.COOKIESECRET || 'MyShopSecret';
// const { errorHandler } = require('../utils')

module.exports = (app) => {
    app.use(express.json());

    // app.use('/api', createProxyMiddleware({ target: 'http://api.example.com', changeOrigin: true }));

    app.use(cookieParser(cookieSecret));

    app.use(express.static(path.resolve(__basedir, 'static')));

    // app.use(auth);

    // app.use(errorHandler(err, req, res, next));
};
