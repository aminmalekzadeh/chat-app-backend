const bodyParser = require('body-parser')
const cors = require('cors');
const express = require('express');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);

module.exports = (app) => {
    app.use('/static',express.static(appDir + "/public"));
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'x-www-form-urlencoded, Origin, X-Requested-With, Content-Type, Accept, Authorization, *');
        if (req.method === 'OPTIONS'){
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
            res.setHeader('Access-Control-Allow-Credentials', true);
            return res.status(200).json({});
        }
        next();
    });
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
    app.use(bodyParser.json());
    app.use(cors());
}