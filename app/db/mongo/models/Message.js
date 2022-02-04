const { Schema, model } = require('mongoose');
const messageSchema = new Schema({
    attachments: {
        type: Schema.Types.Array,
        required: false,
    },
    body: {
        type: String,
        require: true
    },
    contentType: {
        type: String,
        required: true,
        default: 'text'
    },
    senderId: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now
    }
}, {
    collection: 'messages'
});
const Message = model('Message', messageSchema);
module.exports = Message;