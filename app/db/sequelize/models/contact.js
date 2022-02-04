'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static init() {
       return super.init({
        user_id: DataTypes.INTEGER,
        contact_id: DataTypes.INTEGER
      }, {
        sequelize,
        modelName: 'Contact',
      });
    }

    static associate(models) {
      // define association here
      this.myAssociate = this.belongsTo(models.User,{foreignKey: 'contact_id'});
    }
  };
  
  Contact.init(sequelize, DataTypes);
  return Contact;
};