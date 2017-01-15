const controller = require('./workspace-controller');
const auth       = require('../../helpers/auth/middleware');
const config     = require('../../config');
const Validate   = require('../../helpers/request/validate').validate;

const Data = require('./workspace-validate');

module.exports = ( app ) => {

  // DEBUGq
  app.post(`${config.API_V1_PREFIX}/workspaces/:workspaceId/account`,
    auth,
    Validate(Data.PostAddAccountToWorkspace),
    controller.addAccountToWorkspace);

  app.post(`${config.API_V1_PREFIX}/workspaces`, auth, controller.createWorkspace);

};