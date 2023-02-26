const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
// const { auth } = require('../utils');
const cookieSecret = process.env.COOKIESECRET || 'MyShopSecret';
// const { errorHandler } = require('../utils')

module.exports = (app) => {
    app.use(express.json());

    app.use(cookieParser(cookieSecret));

    // app.use(express.static(path.resolve(__basedir, 'static')));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, 'build')));

        app.get('/*', function (req, res) {
            res.sendFile(path.join(__dirname, 'index.html'));
        });
    }
};
