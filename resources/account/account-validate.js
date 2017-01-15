'use strict';

const Types = require('../../helpers/request/validate').types;
const Check = require('../../helpers/request/validate').check;

exports.CRUDUpdate = {
  allowed : [
    {
      type : Types.Email,
      name : 'email',
    },
    {
      type : Types.String,
      name : 'password',
    },
    {
      type : Types.String,
      name : 'firstName',
    },
    {
      type : Types.String,
      name : 'lastName',
    },
    {
      type : Check.Array(Types.Email),
      name : 'secondaryEmails',
    },
    {
      type : Check.Array(Types.String),
      name : 'phoneNumbers',
    },
    {
      type : Check.Array(Types.String),
      name : 'languages',
    },
    {
      type : Types.Number,
      name : 'role'
    },
    {
      type : Types.UUID,
      name : 'accountManager'
    },
    {
      type : Types.Array,
      name : 'addresses',
    },
    {
      type : Types.Boolean,
      name : 'advertiser',
    },
    {
      type : Types.Boolean,
      name : 'manager',
    },
    {
      type : Types.Boolean,
      name : 'publisher',
    },
    {
      type : Types.Boolean,
      name : 'active',
    },
  ]
};

exports.CRUDCreate = {
  required : [
    {
      type : Types.Email,
      name : 'email',
    },
    {
      type : Types.String,
      name : 'password',
    }
  ],
  allowed  : exports.CRUDUpdate.allowed
};

exports.PostLogin = {
  required : [
    {
      type : Types.Email,
      name : 'email',
    },
    {
      type : Types.String,
      name : 'password',
    }
  ],
};
