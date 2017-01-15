const errorHandler    = require('../../helpers/response/error');
const responseHandler = require('../../helpers/response/success');

const workspaceService = require('./workspace-service');
const WorkspaceModel   = require('../../resources').workspace;
const AccountModel     = require('../../resources').account;

exports.addAccountToWorkspace = ( req, res ) => {
  const workspaceId = req.params.workspaceId;
  const accountId   = req.body.account;
  const roles       = req.body.roles;

  // TODO: probably should check if account has rights and all that

  WorkspaceModel.findById(workspaceId)
    .then(workspace => workspace ? workspace : Promise.reject('Unknown Workspace'))
    .then(workspace => AccountModel.findById(accountId)
      .then(account => account ? account : Promise.reject('Unknown Account'))
      .then(account => workspaceService.addAccountToWorkspace(account, workspace, roles)))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))

};


// DEBUG
exports.createWorkspace = ( req, res ) => {

  workspaceService.createWorkspace(req.account)
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))

};