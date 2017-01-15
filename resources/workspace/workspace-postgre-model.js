const WORKSPACE_PLANS = require('../../constants/plans');
const Sequelize       = require('sequelize');

/**
 * Called when creating Models
 * @param sequelize
 */
module.exports.model = sequelize => sequelize.define('workspace', {
    id : {
      type         : Sequelize.UUID,
      defaultValue : Sequelize.UUIDV1,
      primaryKey   : true
    },

    name : Sequelize.STRING,
    plan : { type : Sequelize.STRING, defaultValue : WORKSPACE_PLANS.LEVEL_0 },

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

  models.workspace.belongsToMany(models.account, {
    through    : {
      model  : models.workspaceAccount,
      unique : false,
    },
    foreignKey : 'workspaceId',
  });

};