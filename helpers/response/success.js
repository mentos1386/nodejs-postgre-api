'use strict';

const http = require('http');

/**
 *
 * @param res
 * @param payload
 * @param code
 * @returns {*}
 */
module.exports = ( res, payload, code ) => {
  code        = code || 200;
  payload     = payload || [];
  const title = http.STATUS_CODES[ code ];

  return res.status(code).send({ code, title, payload })
};