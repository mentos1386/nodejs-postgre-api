const controller = require('./account-controller');
const auth       = require('../../helpers/auth/middleware');
const config     = require('../../config');
const Validate   = require('../../helpers/request/validate').validate;

const Data = require('./account-validate');

module.exports = ( app ) => {

  // Public
  app.post(`${config.API_V1_PREFIX}/account/login`, Validate(Data.PostLogin), controller.login);
  app.get(`${config.API_V1_PREFIX}/account/checkLogin`, auth, controller.checkLogin);

  // Protected
  app.get(`${config.API_V1_PREFIX}/account/logout`, auth, controller.logout);

  // CRUD
  app.get(`${config.API_V1_PREFIX}/accounts/`, auth, controller.getList);
  app.post(`${config.API_V1_PREFIX}/accounts/`, auth, Validate(Data.CRUDCreate), controller.CRUDCreate);
  app.get(`${config.API_V1_PREFIX}/accounts/:accountId`, auth, controller.CRUDGet);
  app.post(`${config.API_V1_PREFIX}/accounts/:accountId`, auth, Validate(Data.CRUDUpdate), controller.CRUDUpdate);
  app.delete(`${config.API_V1_PREFIX}/accounts/:accountId`, auth, controller.CRUDDelete);
};