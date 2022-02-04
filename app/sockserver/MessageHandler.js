const eventHandler = require('./EventHandler');

exports.parseMessage = (message) => {
    if(IsJsonString(message)){
        const decodedMessage = JSON.parse(message);
        const { event, ...data } = decodedMessage;
        eventHandler.$run(event, data);
    }else{
        console.log(message)
    }
};

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}