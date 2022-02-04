const { hashPassword, randomHash } = require('../../services/hash');
const token = require('../../services/token');
const db = require('../../db/sequelize/models')

const index = (req, res, next) => {

}

const store = async (req, res, next) => {
    const data = req.body;

    data.hash_id = randomHash()
    data.password = hashPassword(data.password);
    data.displayName = data.firstName + ' ' + data.lastName;
    data.photoURL = '/static/mock-images/avatars/avatar_default.jpg';
    const user = await db.User.findOne({
        where: { email: data.email }
    });
    
    if (user) {
        res.status(401).send({
            success: false,
            message: "already this email or username"
        })
    } else {
        db.User.create(data).then(result => {
            const date = new Date();
            res.send({
                success: true,
                accessToken: token.sign({
                    uuid: data.hash_id,
                    user_id: result.dataValues.id,
                    exp: parseInt((date.setDate(date.getDate() + 1)) / 1000)
                }),
                user: {
                    displayName: data.displayName,
                    email: data.email,
                    photoURL: data.photoURL,
                }
            })
        });
        
    }
}

module.exports = {
    store
}