const ROLES                 = require('../../constants/roles');
const Promise               = require('bluebird');
const WorkspaceModel        = require('../../resources').workspace;
const WorkspaceAccountModel = require('../../resources').workspaceAccount;
const RoleModel             = require('../../resources').role;
const _                     = require('lodash');

/**
 * Create a new workspace
 * @param account
 * @return {Promise}
 */
exports.createWorkspace = ( account ) => {

  return account.createWorkspace()
    .then(workspace => WorkspaceAccountModel.findOne({
      where : {
        workspaceId : workspace.id,
        accountId   : account.id
      }
    }))
    .then(workspaceAccount => workspaceAccount.createRole({ role : ROLES.ADMIN })
      .then(() => workspaceAccount));
};

/**
 *
 * @param workspaces
 * @returns {*}
 */
exports.getWorkspaceResponseData = ( workspaces ) => {

  return workspaces;

};

/**
 *
 * @param account model instance
 * @param workspace model instance
 * @param {Array} roles array of objects
 * @returns {Promise}
 */
exports.addAccountToWorkspace = ( account, workspace, roles ) => {

  return exports.isAccountInWorkspace(account.id, workspace.id)
    .then(( workspaceAccount ) => workspaceAccount ? Promise.reject('Account is already a member of this workspace') : null)
    .then(() => workspace.addAccount(account))
    .then(() => WorkspaceAccountModel.findOne({
      where : {
        workspaceId : workspace.id,
        accountId   : account.id
      }
    }))
    .then(( workspaceAccount ) => Promise.map(roles, role => workspaceAccount.createRole({ role }))
      .then(() => workspaceAccount))

};

/**
 *
 * @param {ObjectId|String} accountId
 * @param {ObjectId|String} workspaceId
 * @returns {Query|*}
 * FIXME: Could just pass workspaces from auth, and check it there. Is probably faster
 */
exports.isAccountInWorkspace = ( accountId, workspaceId ) => {

  return WorkspaceAccountModel.findOne({ where : { workspaceId : workspaceId, accountId : accountId } });

};
