const Sequelize = require('sequelize');

/**
 * Called when creating Models
 * @param sequelize
 */
module.exports.model = sequelize => sequelize.define('workspaceAccount', {
    id : {
      type         : Sequelize.UUID,
      defaultValue : Sequelize.UUIDV1,
      primaryKey   : true
    },

    workspaceId : {
      type : Sequelize.UUID,
    },

    /**
     * workspacePermissions can override specific permissions
     * it should have list of routes and permissions (something like resource-permissions.js files)
     {
	      Project:{
		      READ:false
	      }
     }
     */
    permissions : Sequelize.JSONB,

    accountId : {
      type : Sequelize.UUID,
    },
  },
  {
    timestamps : true,
    paranoid   : true,
  });

/**
 * Called when creating Model Relationships
 * @param models
 * @param sequelize
 */
module.exports.relation = ( models, sequelize ) => {

  models.workspaceAccount.hasMany(models.role);

  models.workspaceAccount.belongsTo(models.workspace);

  models.workspaceAccount.belongsTo(models.account);

};