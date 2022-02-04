const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*",
        methods: ['GET', 'POST']
    }
});
require('./messenger')(io);
module.exports = () => {
    http.listen(process.env.SOCK_PORT, () => console.log(`Listening on port ${process.env.SOCK_PORT}`));
};

