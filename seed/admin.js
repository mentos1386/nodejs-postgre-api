const faker            = require('faker');
const AccountService   = require('../resources/account/account-service');
const WorkspaceService = require('../resources/workspace/workspace-service');

module.exports = () => {
  return AccountService.createAccount({
      email     : 'admin@my.project',
      password  : 'password',
      firstName : 'admin',
      lastName  : 'super',
    })
    .then(accountModel => AccountService.createAccessToken(accountModel)
      .then(token => console.log('ADMIN TOKEN:', token))
      .then(() => WorkspaceService.createWorkspace(accountModel))
      .then(workspace => console.log('WORKSPACE: ', workspace.workspaceId)))
};