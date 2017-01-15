'use strict';

const Types = require('../../helpers/request/validate').types;
const Check = require('../../helpers/request/validate').check;

exports.CRUDUpdate = {
  allowed : [
    {
      type : Types.UUID,
      name : 'id',
    },
    // TODO: Write Validation Roules
  ]
};

exports.CRUDCreate = {
  allowed : exports.CRUDUpdate.allowed
};

