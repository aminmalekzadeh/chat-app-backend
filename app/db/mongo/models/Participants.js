const { Schema,model } = require('mongoose');
const participantsSchema = new Schema({
    name: {
        type: String,
        required: false,
    },
    hash_id: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        required: false,
    },
    status: {
        type: String,
        required: false,
    },
    lastActivity: {
        type: Date,
        require: false
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now
    }
}, {
    collection: 'participants'
});
const Participant = model('Participant', participantsSchema);
module.exports = Participant;