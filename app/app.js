const express = require('express');


const app = express();


require('./boot')(app)
require('./middleware')(app);
require('./routes')(app);

const startApp = () => {
    
    app.listen(process.env.APP_PORT , () => {
        console.log("app is running...");
    })
}

module.exports = startApp;