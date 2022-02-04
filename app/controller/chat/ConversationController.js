const mongoose = require('mongoose');
const Conversations = require('../../db/mongo/models/Conversation');
const Message = require('../../db/mongo/models/Message');
const Participants = require('../../db/mongo/models/Participants');
const db = require('../../db/sequelize/models');

const tokenService = require('../../services/token');


const index = async (req, res) => {

    const token = tokenService.findToken(req);
    const tokenPayload = tokenService.verify(token);

    const participants = await Participants.find({
        hash_id: tokenPayload.uuid
    }).then(async (value) => {
        if(value.length != 0){
            const conversations = await Conversations.find({
                participants: mongoose.Types.ObjectId(value[0]._id)
            })
            const conversationPopulate = await Conversations.populate(conversations, [{ path: 'participants' }, { path: 'messages' }]);
    
            res.send({
                conversations
            });
        }else{
            res.send({
                conversations: []
            });
        }

    });

}

const store = (req, res) => {
    const { conversation } = req.body;

    Message.create(conversation.messages).then((docMessage) => {
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const participantIds = [];

        const PromiseParticipants = new Promise(function (resolve, reject) {
            conversation.participants.forEach((element, index) => {
                Participants.findOneAndUpdate(element, element, options, function (error, result) {
                    if (error) reject(error);
                    participantIds.push(result._id);
                    if (index === 1) { 
                        resolve(participantIds);
                    }
                });
            });
        })

        PromiseParticipants.then((Participants) => {
            const newConversation = new Conversations({
                messages: docMessage[0]._id,
                type: conversation.type,
                participants: Participants,
                unreadCount: conversation.unreadCount
            });

            newConversation.save(async (err, doc) => {
                if (!err) {
                    await Conversations.populate(doc, [{ path: 'participants' }, { path: 'messages' }]);

                    res.send({
                        success: true,
                        message: "Created new Conversation with Successfully!",
                        conversation: doc
                    })
                } else {
                    res.send({
                        success: false,
                        message: err
                    })
                }
            });
        })

    });


}

const one = async (req, res) => {
    const { conversationKey } = req.query;

    if (conversationKey != '') {
        const conversation = await Conversations.findOne({
            _id: conversationKey
        }).exec();

        const conversationPopulate = await Conversations.populate(conversation, [{ path: 'participants' }, { path: 'messages' }]);
        return res.send({
            conversation: conversationPopulate
        })
    } else {
        return res.status(500).send({
            success: false,
            message: "error!"
        })
    }

}

const markAsSeen = async (req, res) => {
    const { conversationId } = req.query;

    const conversation = await Conversations.findOneAndUpdate(
        {
            _id: conversationId
        },
        {
            unreadCount: 0
        },
        {
            new: true
        }).exec();

    const conversationPopulate = await Conversations.populate(conversation, [{ path: 'participants' }, { path: 'messages' }]);

    return res.send({
        conversation: conversationPopulate
    })

}

const update = async (req, res) => {
    const { conversation } = req;

    const { senderId, conversationId, message, contentType } = conversation;
    const conversation_query = await Conversations.findOne(
        {
            _id: conversationId
        }).exec();

    if (!conversation_query) {
        return res.status(422).send({
            success: false,
            message: 'گفتگویی با این مشخصات در سیستم وجود ندارد'
        });
    }
    await conversation_query.messages.push({ senderId, body: message, contentType });
    await conversation_query.save((err, result) => { });
    res.send({
        conversation
    })
}


module.exports = {
    index,
    store,
    one,
    markAsSeen,
    update
}