'use strict';
const _         = require('lodash');
const sequelize = require('../database-postgres').getSequelize();
const logger    = require('../helpers/log/logger');

const HELPERS = {
  getModelName : ( name ) => `${name}-postgre-model`,
};

exports.init = ( app ) => {

  /**
   * LOAD MongoDB Models
   */
  logger.log('info', 'Loading MongoDB Models');
  require('require-all')({
    dirname     : __dirname,
    filter      : /(.+-mongo-model)\.js$/,
    excludeDirs : /^\.(git|svn)$/,
    recursive   : true
  });

  // Set Mongoose Promise to BlueBird
  require('mongoose').Promise = require('bluebird');

  /**
   * LOAD Postgres Models
   */
  logger.log('info', 'Loading Postgres Models');
  const models = require('require-all')({
    dirname     : __dirname,
    filter      : /(.+-postgre-model)\.js$/,
    excludeDirs : /^\.(git|svn)$/,
    recursive   : true
  });

  let postgreModels = {};
  // Create Models
  _.each(models, ( object, key ) =>
    postgreModels[ key ] = object[ HELPERS.getModelName(key) ] && object[ HELPERS.getModelName(key) ].model ?
      object[ HELPERS.getModelName(key) ].model(sequelize) : null);
  // Create Relations
  _.each(models, ( object, key ) =>
    object[ HELPERS.getModelName(key) ] && object[ HELPERS.getModelName(key) ].relation ?
      object[ HELPERS.getModelName(key) ].relation(postgreModels, sequelize) : null);
  // Create Scopes
  _.each(models, ( object, key ) =>
    object[ HELPERS.getModelName(key) ] && object[ HELPERS.getModelName(key) ].scope ?
      object[ HELPERS.getModelName(key) ].scope(postgreModels) : null);

  exports = postgreModels;

  logger.log('info', 'Setting up database');
  // Change this to false, if you want to apply model changes to db
  const force = false;
  sequelize.sync({ force });

  if ( app ) {
    /**
     * LOAD Routes
     */
    const routers = require('require-all')({
      dirname     : __dirname,
      filter      : /(.+-routes)\.js$/,
      excludeDirs : /^\.(git|svn)$/,
      recursive   : true
    });

    // Add routes to app
    _.each(routers, resource => _.each(resource, router => router(app)));
  }
};