'use strict';

const _          = require('lodash');
const http       = require('http');
const MainLogger = require('../log/logger');

/**
 * Default Error  Handler
 * @param express
 * @param {String} err
 * @param {Number} err.code
 * @param err.title
 * @param err.resStatus
 * @param err.messages
 * @param code
 * @param payload
 */
module.exports = ( express, err, code, payload ) => {

  // Check if err contains responseHandler code
  if ( !code && err && err.resStatus || err.code ) code = err.resStatus || err.code;

  // Check that error code exists as HTTP status code
  if ( !http.STATUS_CODES[ code ] ) code = null;

  // If err is String, make it object with String as message
  if ( _.isString(err) ) err = { message : err };

  code         = code || 500;
  err          = err || {};
  payload      = payload || [];
  err.title                  = err.title || http.STATUS_CODES[ code ];
  err.messages = err.messages || [];

  // If single message, add it to array
  if ( err.message ) err.messages.push({ message : err.message });

  const response = {
    code     : code,
    title    : err.title,
    messages : err.messages,
    payload  : payload,
    path     : express.req.path
  };

  if ( process.env.NODE_ENV === 'development' ) {
    console.log(err.stack);
  }

  // If 500, log as error. Else log as debug
  if ( code === 500 ) MainLogger.log('error', response);
  else MainLogger.log('debug', response);

  return express.res.status(code).send(response)
};