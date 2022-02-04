const clientManager = require('./ClientManager');
const { parseMessage } = require('./MessageHandler');
const Connection = require('./connection');

const onError = (err) => { console.log('error in sockjs connection', err); };
module.exports = (SockConnection) => {
    SockConnection.on('connection', (connection) => {
        console.log('new client connected');
        new Connection(SockConnection, connection);
    });
 
};




function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}