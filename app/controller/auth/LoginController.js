const { comparePassword } = require('../../services/hash');
const db = require('../../db/sequelize/models')
const token = require('../../services/token');

const index = async (req, res, next) => {
    const request = req.body;
    const user = await db.User.findOne({
        where: {
            email: request.email
        }
    });

    if (!user) {
        res.status(401).send({
            success: false,
            message: "Not Found User, Please Signup!"
        });
    } else if (comparePassword(request.password, user.password)) {
        const date = new Date();
        
        res.send({
            success: true,
            accessToken: token.sign({
                uuid: user.hash_id,
                user_id: user.id,
                exp: parseInt((date.setDate(date.getDate() + 1)) / 1000)
            }),
            user: {
                displayName: user.displayName,
                email: user.email,
                photoURL: '/static/mock-images/avatars/avatar_default.jpg',
            }
        });
    } else {
        res.status(401).send({
            success: false,
            message: "Password is incorrect!"
        });
    }







}

module.exports = {
    index
}