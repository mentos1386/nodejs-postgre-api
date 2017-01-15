const Sequelize = require('sequelize');

/**
 * Called when creating Models
 * @param sequelize
 */
module.exports.model = ( sequelize ) => sequelize.define('account', {
    id              : {
      type         : Sequelize.UUID,
      defaultValue : Sequelize.UUIDV1,
      primaryKey   : true
    },

    // TODO: Add properties

  },
  {
    timestamps : true,
    paranoid   : true
  });

/**
 * Called when creating Model Relationships
 * @param models
 * @param sequelize
 */
module.exports.relation = ( models, sequelize ) => {

  // TODO: Add relations

};