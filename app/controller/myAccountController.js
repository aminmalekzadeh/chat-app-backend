const db = require('../db/sequelize/models');
const Participant = require('../db/mongo/models/Participants');
const tokenService = require('../services/token');
const { hashPassword } = require('../services/hash');
 
  
const index = async (req, res) => {
 
    const token = tokenService.findToken(req);
    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'unauthorized access!'
        });
    }
    try {
        const { uuid } = tokenService.verify(token);
        const user = await db.User.findOne({
            where: {
                hash_id: uuid
            }
        });
        res.send({
            success: true,
            user
        })
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'unauthorized access!'
        });
    }


}

const update = async (req, res) => {
    const data = req.body;

    const token = tokenService.findToken(req);
    const { uuid } = tokenService.verify(token);

    if (data.password !== '') {
        data.password = hashPassword(data.password);
    }
    Object.keys(data).forEach(key => {
        if (data[key] === '') {
            delete data[key];
        }
    })

    const ImageProfile = process.env.APP_URL + ":" + process.env.APP_PORT + '/static/ImageProfile/' + req.files[0].filename;
    data.photoURL = ImageProfile;
    const participants = await Participant.updateOne({hash_id: uuid}, {avatar: ImageProfile});
    const user = await db.User.update(
        data,
        {
            where: {
                hash_id: uuid
            }
        }
    ).then((result) => {

        return res.send({
            success: true,
            user: {
                displayName: data.firstName + " " + data.lastName,
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phoneNumber,
                country: data.country,
                userName: data.userName,
                photoURL: ImageProfile
            }
        })
    }).catch(err => {
        return res.status(500).send({
            success: true,
            message: err
        })
    });
}

module.exports = {
    index,
    update
}