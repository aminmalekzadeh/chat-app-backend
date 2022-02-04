const { database } = require('faker/locale/en_BORK');
const Conversations = require('../../db/mongo/models/Conversation');
const tokenService = require('../../services/token');
 
const index = async (req, res) => {
    const { query } = req.query;
    const token = tokenService.findToken(req);
    const tokenPayload = tokenService.verify(token);
    const regex = new RegExp(query, 'i');
    const conversations = await Conversations.find(
        {  
            "participants.hash_id": tokenPayload.uuid,
            "participants.name":
            {
                $regex: regex
            }
        },
    ).exec();
 
    let data = [];
    conversations.forEach((conversation) => {
        const { _id: conversationId } = conversation;

        conversation.participants.forEach((participant) => {

            if (tokenPayload.uuid !== participant.hash_id) {
                const newParticipant = {
                    user: participant,
                    conversationId
                }
                data.push(newParticipant)
            }

        })
    })
    res.send({
        results: data,
    });
}


module.exports = {
    index
}