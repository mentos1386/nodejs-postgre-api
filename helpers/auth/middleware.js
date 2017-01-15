'use strict';

const mongoose   = require('mongoose');
const _          = require('lodash');
const UrlPattern = require('url-pattern');
const Promise    = require('bluebird');
const Logger     = require('../log/logger');

module.exports = ( req, res, next ) => {

  const AccountModel     = require('../../resources').account;
  const AuthTokenModel   = require('../../resources').authToken;
  const WorkspaceModel   = require('../../resources').workspace;
  const WorkspaceAccount = require('../../resources').workspaceAccount;
  const RoleModel        = require('../../resources').role;
  const token            = req.headers[ 'authorization' ];
  const workspaceId      = req.headers[ 'workspace' ];

  AccountModel.findOne({
      include : [ {
        model : AuthTokenModel,
        where : {
          value     : token,
          expiresAt : {
            $gt : new Date()
          }
        }
      } ]
    })
    .then(account => account && token && workspaceId ? account : Promise.reject({
        message : 'Invalid authorization',
        code    : 401
      }))
    .then(account => WorkspaceAccount.findAll({
        where   : { accountId : account.id },
        include : [ WorkspaceModel, RoleModel ]
      })
      .then(workspaces => {
        return {
          account,
          workspaces
        }
      }))
    .then(accountData => {
      const inWorkspace = _.find(accountData.workspaces, { workspaceId });
      if ( !inWorkspace ) return Promise.reject({ message : 'Not allowed', code : 403 });

      const isAllowed = _.some(inWorkspace.roles, role => checkAccess(req, role));
      if ( !isAllowed ) return Promise.reject({ message : 'Not allowed', code : 403 });

      accountData.activeWorkspace = inWorkspace;
      req.accountData             = accountData;
    })
    .then(() => next())
    .catch(err => next(err));

};

/**
 *  Get all permissions from resources folders
 */
const Permissions = require('require-all')({
  dirname     : __dirname + '/../../resources/',
  filter      : /(.+-permissions)\.js$/,
  excludeDirs : /^\.(git|svn)$/,
  recursive   : true
});

/**
 * Method that checks if the account has permission to request this resource with this method
 * TODO: Make it check custom permissions in workspaceAccount table
 * @param req expects the request to check method, and path
 * @param reqRole expects role document
 * @returns {boolean}
 */
function checkAccess( req, reqRole ) {
  const roles  = require('../../constants/roles');
  const method = req.method.toLowerCase();
  const path   = req.path;
  const role   = roles[ reqRole.role ];

  if ( !role ) {
    Logger.log('warn', 'Unknown role used', reqRole, req);
    return false
  }

  let allowed = false;

  const listPermissions = _.reduce(Permissions,
    ( all, permission ) => _.reduce(permission, ( all, p ) => _.union(all, p), all),
    []);

  _.each(listPermissions, ( aclItem, i ) => {
    const pattern = new UrlPattern(aclItem.prefix ? aclItem.prefix + aclItem.path : aclItem.path);
    const match   = pattern.match(path);

    if ( match ) {
      _.each(aclItem.roles, ( _role, j ) => {
        if ( _role.type === role || _role.type === '*' ) {
          _.each(_role.methods, ( _method, k ) => {
            if ( _method === method.toLowerCase() ) {
              allowed = true;
            }
          });
        }
      });
    }
  });

  return allowed;
}
