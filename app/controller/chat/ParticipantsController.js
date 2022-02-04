const db = require('../../db/sequelize/models');
const Conversations = require('../../db/mongo/models/Conversation');
const Participants = require('../../db/mongo/models/Participants');
const tokenService = require('../../services/token');

const index = async (req, res) => {
    const { conversationKey } = req.query;

    const conversations = await Conversations.findOne({
        _id: conversationKey
    }).exec();
    const conversationPopulate = await Conversations.populate(conversations, { path: 'participants' });

    res.send({
        participants: conversations.participants
    }); 
}


module.exports = {
    index
}