const controller = require('./{NAME}-controller');
const auth       = require('../../helpers/auth/middleware');
const config     = require('../../config');
const Validate   = require('../../helpers/request/validate').validate;

const Data = require('./{NAME}-validate');

module.exports = ( app ) => {

  app.get(`${config.API_V1_PREFIX}/{NAME}s/`, auth, controller.getList);

  // CRUD
  app.post(`${config.API_V1_PREFIX}/{NAME}s/`, auth, Validate(Data.CRUDCreate), controller.CRUDCreate);
  app.get(`${config.API_V1_PREFIX}/{NAME}s/:offerId`, auth, controller.CRUDGet);
  app.post(`${config.API_V1_PREFIX}/{NAME}s/:offerId`, auth, Validate(Data.CRUDUpdate), controller.CRUDUpdate);
  app.delete(`${config.API_V1_PREFIX}/{NAME}s/:offerId`, auth, controller.CRUDDelete);
};