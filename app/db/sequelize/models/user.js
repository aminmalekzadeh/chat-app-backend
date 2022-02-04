'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
   toJSON() {
    var values = Object.assign({}, this.get());

    delete values.password;
    return values;
   }
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static init() {
    return super.init({
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      hash_id: DataTypes.STRING,
      userName: DataTypes.STRING,
      password: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      photoURL: DataTypes.STRING,
      displayName: DataTypes.STRING,
      status: DataTypes.STRING
    }, {
      sequelize,
      modelName: 'User',
    });
  }

    static associate(models) {
    // define association here
  }
};

User.init(sequelize, DataTypes);
return User;
};