require('module-alias/register')
require('dotenv').config();
const startApp = require('./app/app');
const startSockServer = require('./app/sockserver');
startApp();
startSockServer();