'use strict';
const _     = require('lodash');

const Types = require('../../helpers/request/validate').types;
const Check = require('../../helpers/request/validate').check;
const ROLES = require('../../constants/roles');

module.exports.PostAddAccountToWorkspace = {
  required : [
    {
      type : Check.Array(_.map(ROLES, role => role)),
      name : 'roles'
    },
    {
      type : Types.UUID,
      name : 'account'
    },
  ]
};
