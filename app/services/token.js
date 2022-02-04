const jwt = require('jsonwebtoken');

exports.findToken = (req) => {
    const auth = req.headers['authorization'];
    if(!auth || auth === undefined){
        return false;
    }
    const [bearer,token] = auth.split(' ');
    if(!token){
        return false;
    }
    return token;
}

exports.sign = (params) => {

    return jwt.sign(params, process.env.JWT_SECRET);

}

exports.verify = (token) => {

    return jwt.verify(token, process.env.JWT_SECRET)

};