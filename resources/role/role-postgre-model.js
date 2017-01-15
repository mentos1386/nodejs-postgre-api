const Sequelize = require('sequelize');
const ROLES     = require('../../constants/roles');

/**
 * Called when creating Models
 * @param sequelize
 */
module.exports.model = sequelize => sequelize.define('role', {
    id : {
      type         : Sequelize.UUID,
      defaultValue : Sequelize.UUIDV1,
      primaryKey   : true
    },

    role : { type : Sequelize.STRING, defaultValue : ROLES[ 'USER' ] },

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

  models.role.belongsTo(models.workspaceAccount);

};