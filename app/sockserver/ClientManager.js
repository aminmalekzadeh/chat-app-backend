// const onlineManager = require('./OnlineManager');
// const url = require('url');
// const clients = {};
// const getUserHash = (socketURL) => {
//     const urlToParse = url.parse(socketURL);
//     const urlQueryParts = String(urlToParse.query).split('=');
//     return urlQueryParts[1];
// };

// exports.addClient = (connection) => {
//     const id = getUserHash(connection.url);
//     if (!(id in clients)) {
//         clients[id] = connection;
//         onlineManager.addOnlineUser(id, connection.remoteAddress).then((result) => {
//             onlineManager.broadCastOnlineUsers();
//         }).catch(err => {
//             console.log({ error: err.message });
//         });
//     }
// };
// exports.removeClient = (connection) => {
//     const id = getUserHash(connection.url);
//     if (id in clients) {
//         delete clients[id];
//         onlineManager.removeOnlineUser(id).then(() => {
//             onlineManager.broadCastOnlineUsers();
//         }).catch(err => {
//             console.log(err.message);
//         });
//     }
// };
// exports.getClient = (id) => {
//     if (clients.hasOwnProperty(id)) {
//         return clients[id];
//     }
// };
// exports.allClients = () => {
//     return clients;
// };