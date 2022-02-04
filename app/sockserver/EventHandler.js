const clientManager = require('./ClientManager');
const events = {};
const sendToClient = () => { };
const sendToAll = () => { };

exports.$on = (event, handler) => {
    events[event] = handler;
};
exports.$emit = (event, data) => {
    const { to } = data;
    delete data['to'];
    const client = clientManager.getClient(to);
    if (client) {
        client.write(JSON.stringify(
            {
                event,
                ...data
            }
        ));
    }
};
exports.$run = (event, data) => {
    if (event in events) {
        events[event](data);
    }
};
exports.$broadcast = (event, data) => {
    const clients = clientManager.allClients();
    if (clients && Object.keys(clients).length > 0) {
        Object.keys(clients).forEach(clientID => {
            const connection = clientManager.getClient(clientID);
            connection.write(JSON.stringify(
                {
                    event,
                    ...data
                }
            ));
        });
    }
};