const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
exports.randomHash = () => {
    return uuidv4();
}

exports.hashPassword = (password) => {
    return bcrypt.hashSync(password, 8);
};

exports.comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}