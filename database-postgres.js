'use strict';

const Sequelize = require('sequelize');
const cfg       = require('./config');
const logger    = require('./helpers/log/logger');

let sequelize;

exports.connect = () => {
  logger.log('info', `Connect to POSTGRES database:  ${cfg.DB.POSTGRES.HOST}/${cfg.DB.POSTGRES.DB}`);

  sequelize = new Sequelize(cfg.DB.POSTGRES.DB, cfg.DB.POSTGRES.USER, cfg.DB.POSTGRES.PASS, {
    host    : cfg.DB.POSTGRES.HOST,
    dialect : 'postgres',
    logging : logger.verbose,
  });

  return sequelize.authenticate()
};

exports.getSequelize = () => sequelize;