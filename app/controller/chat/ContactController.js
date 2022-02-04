const db = require('../../db/sequelize/models')
const tokenService = require('../../services/token');

const index = async (req, res) => {

    const token = tokenService.findToken(req);
    const tokenPayload = tokenService.verify(token);

    const contacts = await db.Contact.findAll({
        include: db.User,
        where: {
            user_id: tokenPayload.user_id
        },
    });

    res.send({
        success: true,
        contacts: contacts.map(contact => contact.User)
    })
    
}

const store = async (req, res) => {
    const {userId} = req.body;
    const token = tokenService.findToken(req);
    const tokenPayload = tokenService.verify(token);
    const contacts = await db.Contact.create({
        user_id: tokenPayload.user_id,
        contact_id: userId
    });
    const contact = await db.User.findOne({
        where: {
            id: userId
        }
    })
    res.send({
        success:true,
        contact
    })
}

const search = async (req, res) => {
    const query = req.query;
    const contacts = await db.User.findAll({
        where: {
            userName: {
                [db.Sequelize.Op.like] : `%${query.search}%`
            }
        },
    });

    res.send({
        success: true,
        contacts
    })
}

module.exports = {
    index,
    search,
    store
}