'use strict';

const config = require('../../config');

const mongoose       = require('mongoose');
const Promise        = require('bluebird');

const responseHandler = require('../../helpers/response/success');
const errorHandler    = require('../../helpers/response/error');
const _              = require('lodash');

const emailService     = require('../../services/email-service');
const accountService   = require('./account-service');
const workspaceService = require('../workspace/workspace-service');
const PasswordService  = require('../../helpers/auth/password');

const AccountModel   = require('../../resources').account;
const WorkspaceModel = require('../../resources').workspace;
const RoleModel      = require('../../resources').role;

/**
 * Get specific Account
 */
exports.CRUDGet = ( req, res ) => {
  AccountModel.scope(accountService.scopeWorkspace(req.accountData.activeWorkspace, WorkspaceModel))
    .findById(req.params.accountId)
    .then(doc => doc ? doc : Promise.reject('Account not found'))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Create Account
 */
exports.CRUDCreate = ( req, res ) => {
  accountService.createAccount(req.body)
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Update Account
 */
exports.CRUDUpdate = ( req, res ) => {
  AccountModel.scope(accountService.scopeWorkspace(req.accountData.activeWorkspace, WorkspaceModel))
    .findById(req.params.accountId)
    .then(model => model ? model : Promise.reject('Account not found'))
    .then(model => accountService.updateAccount(req.body, model))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Delete Account
 */
exports.CRUDDelete = ( req, res ) => {
  AccountModel.scope(accountService.scopeWorkspace(req.accountData.activeWorkspace, WorkspaceModel))
    .findById(req.params.accountId)
    .then(model => model ? model : Promise.reject('Account not found'))
    .then(model => accountService.deleteAccount(model))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Get list of Accounts
 */
exports.getList = ( req, res ) => {
  const page    = req.query.page || 1;
  const perPage = req.query.perPage || 20;
  const offset  = (page - 1) * perPage;

  // TODO: Ordering

  AccountModel.scope(accountService.scopeWorkspace(req.accountData.activeWorkspace, WorkspaceModel))
    .findAndCountAll({ perPage, offset })
    .then(model => {
      return {
        data     : model.rows,
        page,
        perPage,
        numItems : model.count,
        numPages : Math.round(model.count / perPage) + 1,
      }
    })
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err))
};

/**
 * Check if Account is Authenticated, return permissions
 */
exports.checkLogin = ( req, res ) => responseHandler(res, {
  account         : accountService.getAccountResponseData(req.accountData.account),
  workspaces      : workspaceService.getWorkspaceResponseData(req.accountData.workspaces),
  activeWorkspace : workspaceService.getWorkspaceResponseData(req.accountData.activeWorkspace),
});

/**
 * Login Account
 */
exports.login = ( req, res ) => {
  AccountModel.findOne({ where : { email : req.body.email } })
    .then(( accountModel ) => {
      if ( !accountModel ) return Promise.reject({
        code     : 400,
        title    : 'Data validation failed',
        messages : [ {
          message : 'Email or password is not valid',
          param   : 'password'
        } ]
      });

      return PasswordService.compare(req.body.password, accountModel.password)
        .then(( success ) => {
          if ( !success ) return Promise.reject({
            code     : 400,
            title    : 'Data validation failed',
            messages : [ {
              message : 'Email or password is not valid',
              param   : 'password'
            } ]
          });
          return accountModel;
        })
        .then(accountModel => accountService.createAccessToken(accountModel))
        .then(token => accountModel.getWorkspaces()
          .then(workspaces => Promise.map(workspaces, workspace => workspace.workspaceAccount.getRoles())
            .then(roles => {
              return {
                token,
                workspaces : _.map(workspaces, workspace => {
                  workspace       = workspace.toJSON();
                  workspace.roles = roles;
                  return workspace
                })
              }
            })))
    })
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err));
};

/**
 * Logout Account
 */
exports.logout = ( req, res ) => {
  accountService.removeAccessToken(req)
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err));
};