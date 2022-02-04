const BlockedUsers = require('../db/mongo/models/BlockedUsers');
const tokenService = require('../services/token');
   
const index = async (req, res) => {
    const token = tokenService.findToken(req);
    const { uuid } = tokenService.verify(token);
    const blockedUsers = await BlockedUsers.findOne({ user_hash_id: uuid });
    if (blockedUsers) {
        res.send({
            success: true,
            blockedUsers: blockedUsers.user_block_id
        })
    } else {
        res.send({
            success: true,
            blockedUsers: []
        })
    }

}

const store = async (req, res) => {
    const users = req.body;
    const token = tokenService.findToken(req);
    const { uuid } = tokenService.verify(token);
    const options = { upsert: true, new: true, setDefaultsOnInsert: true };

    const blockeduser = await BlockedUsers.findOneAndUpdate({ user_hash_id: uuid }, {
        user_hash_id: uuid,
        user_block_id: users.user_block_id
    }, options);

    res.send({
        success: true,
        blockeduser
    })

}

const deleteItem = async (req, res) => {
    const users = req.body;
    const token = tokenService.findToken(req);
    const { uuid } = tokenService.verify(token);

    const blockedUsers = await BlockedUsers.findOneAndDelete({ user_hash_id: uuid }, {
        user_hash_id: uuid,
        user_block_id: users.user_block_id
    });
 
    res.send({
        success: true,
        blockedUsers: blockedUsers.user_block_id
    })
}

const indexBlockedOthers = async (req, res) => {
    const token = tokenService.findToken(req);
    const { uuid } = tokenService.verify(token);
    const blockedOthers = await BlockedUsers.findOne({ user_block_id: uuid });
    if (blockedOthers) {
        res.send({
            success: true,
            blockedOthers: blockedOthers.user_hash_id
        })
    } else {
        res.send({
            success: true,
            blockedOthers: []
        })
    }
}
 
module.exports = {
    index,
    store,
    deleteItem,
    indexBlockedOthers
}