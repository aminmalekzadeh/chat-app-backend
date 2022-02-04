const { Schema, model } = require('mongoose');

const onlineUserSchema = new Schema({
    user: Schema.Types.String,
}, {
    collection: 'online_users'
});
const OnlineUser = model('OnlineUsers',onlineUserSchema);
module.exports = OnlineUser;