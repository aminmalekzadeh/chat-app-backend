const tokenService = require('../services/token');
const auth = (req, res, next) => {

    const token = tokenService.findToken(req);
    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'unauthorized access!'
        });
    }
    try {
        const payload = tokenService.verify(token);
    } catch (error) {
        return res.status(401).send({
            success: false,
            message: 'unauthorized access!'
        });
    }
    next();

};
module.exports = {
    auth
};