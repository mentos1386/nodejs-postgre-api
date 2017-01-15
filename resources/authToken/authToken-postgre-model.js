const Sequelize = require('sequelize');
const Token     = require('rand-token');

/**
 * Called when creating Models
 * @param sequelize
 */
module.exports.model = ( sequelize ) => sequelize.define('authToken', {
    id : {
      type         : Sequelize.UUID,
      defaultValue : Sequelize.UUIDV1,
      primaryKey   : true
    },

    value : {
      type         : Sequelize.STRING,
      defaultValue : () => Token.generate(255),
      unique       : true,
    },

    expiresAt : {
      type         : Sequelize.DATE,
      defaultValue : () => +new Date() + 1000 * 60 * 60 * 2,
    },

  },
  {
    timestamps : true,
    updatedAt  : false,
    paranoid   : true,
  });

/**
 * Called when creating Model Relationships
 * @param models
 * @param sequelize
 */
module.exports.relation = ( models, sequelize ) => {

  models.authToken.belongsTo(models.account);

};