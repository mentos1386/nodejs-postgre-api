'use strict';
const Promise          = require('bluebird');
const mongoose         = require('mongoose');
const Password         = require('../../helpers/auth/password');
const AccessLog        = require('../../helpers/log/logger').access;
const AccountModel     = require('../../resources').account;
const AccountConstants = require('../../constants/account');
const _                = require('lodash');

/**
 * Create Workspace Scope to be used with sql queries
 * @param activeWorkspace
 * @param WorkspaceModel
 * @returns {{method: [string,*,*]}}
 */
exports.scopeWorkspace = ( activeWorkspace, WorkspaceModel ) => {
  return { method : [ 'workspace', activeWorkspace.workspace, WorkspaceModel ] }
};

/**
 * Create new account
 * @param accountObject
 * @returns {Promise}
 */
exports.createAccount = ( accountObject ) => {

  // Fix addresses owner
  accountObject.addresses = _.map(accountObject.addresses, address => {
    address.owner = "account";
    return address
  });

  return Password.generate(accountObject.password)
    .then(( hash ) => accountObject.password = hash)
    .then(() => AccountModel.create(accountObject, { include : [ AddressModel ] }))
};

/**
 * Update account
 * @param accountObject
 * @param accountModel
 * @returns {Promise}
 */
exports.updateAccount = ( accountObject, accountModel ) => {

  return new Promise(( resolve, reject ) => {
    if ( accountObject.password ) {
      Password.generate(accountObject.password)
        .then(hash => resolve(hash))
    }
    resolve();
  })
    .then(( hash ) => {
      if ( hash ) accountObject.password = hash;
    })
    .then(() => accountModel.update(accountObject, { include : [ AddressModel ] }))
};

/**
 * Delete account
 * @param accountModel
 * @returns {Promise}
 */
exports.deleteAccount = ( accountModel ) => {
  return accountModel.destroy()
    .then(() => {
      return { message : 'Account Deleted' }
    })
};

/**
 * Create access token
 * @param accountModel
 * @returns {Promise}
 */
exports.createAccessToken = ( accountModel ) => {

  AccessLog({
    account : accountModel.id
  });

  return accountModel.createAuthToken().then(model => model.value)
};

/**
 * Remove access token
 * @param req
 * @returns {Promise}
 */
exports.removeAccessToken = ( req ) => {
  const accountModel = req.AccountData.account;

  const authToken = _.find(accountModel.authTokens, { value : req.headers[ 'authorization' ] });

  if ( !authToken ) return Promise.reject('Token error'); // Should never happen

  return authToken.destroy()
    .then(( model ) => {
      return { token : model.value }
    })
};

// TODO: DOWN BELLOW
/**
 * Format the database model to public model
 * @param accountDoc
 * @returns {{_id: *, email: *, name: *, surname: (*|string|String)}}
 */
exports.getAccountResponseData = accountDoc => {

  return {
    id        : accountDoc.id,
    email     : accountDoc.email,
    firstName : accountDoc.firstName,
    lastName  : accountDoc.lastName,
  };

};
