const { Schema, model } = require('mongoose');

const blockedUser = new Schema({ 
    user_hash_id: {
        type: String,
        required: true,
    },
    user_block_id: {
        type: String,
        required: true,
    }
}, {
    collection: 'blockedusers'
});
const BlockedUser = model('BlockedUser', blockedUser);
module.exports = BlockedUser;