const Sequelize = require('sequelize');

/**
 * Called when creating Models
 * @param sequelize
 */
module.exports.model = ( sequelize ) => sequelize.define('account', {
    id    : {
      type         : Sequelize.UUID,
      defaultValue : Sequelize.UUIDV1,
      primaryKey   : true
    },
    email : {
      type      : Sequelize.STRING,
      allowNull : false,
      unique    : true,
      validate  : {
        isEmail : true
      }
    },

    password  : { type : Sequelize.STRING, allowNull : false },
    firstName : Sequelize.STRING,
    lastName  : Sequelize.STRING,

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

  models.account.hasMany(models.authToken);

  models.account.belongsToMany(models.workspace, {
    through    : {
      model  : models.workspaceAccount,
      unique : false,
    },
    foreignKey : 'accountId',
  });

};

/**
 * Called after relations
 * @param models
 */
module.exports.scope = ( models ) => {
  models.account.addScope('workspace', ( workspace ) => {
    return {
      include : [ {
        model : models.workspace,
        where : {
          id : workspace.id
        }
      } ]
    }
  })
};