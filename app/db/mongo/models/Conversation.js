const { Schema, model } = require('mongoose');

const conversation = new Schema({
    messages: [{
        type: Schema.Types.ObjectId,
        ref: 'Message'
    }],
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'Participant'
    }], 
    type: {
        type: String,
        required: true,
    },
    unreadCount: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
}, {
    collection: 'conversations'
});
const Conversation = model('Conversation', conversation);
module.exports = Conversation;