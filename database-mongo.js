const mongoose = require('mongoose');
const cfg      = require('./config');
const logger   = require('./helpers/log/logger');

exports.connect = () => {
  return new Promise(( resolve, reject ) => {

    logger.log('info', `Connect to MONGO database:  ${cfg.DB.MONGO.HOST}/${cfg.DB.MONGO.NAME}`);

    mongoose.connect(`${cfg.DB.MONGO.HOST}/${cfg.DB.MONGO.NAME}`);
    mongoose.connection.on('error', err => reject(err));
    mongoose.connection.once('open', () => resolve());
  });
};