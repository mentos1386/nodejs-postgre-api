const winston = require('winston');
require('winston-daily-rotate-file');

const debugLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info';

/**
 *  Main Logger
 */
const mainLogger = new (winston.Logger)({
  levels    : {
    error  : 0,
    warn   : 1,
    info   : 2,
    verbose: 3,
    debug  : 4,
    silly  : 5
  },
  colors    : {
    error  : 'red',
    warn   : 'yellow',
    info   : 'blue',
    verbose: 'red',
    debug  : 'white'
  },
  transports: [
    // Console Output
    new (winston.transports.Console)({
      level   : debugLevel,
      colorize: true
    }),
    // Daily File Output
    new (winston.transports.DailyRotateFile)({
      name: 'main-log',
      filename: __dirname + '/../../log/main.log',
      level   : debugLevel
    }),
  ]
});

module.exports = mainLogger;

/**
 * Access Logger
 */
const accessLogger = new (winston.Logger)({
  levels    : { access  : 1 },
  colors    : { access  : 'cyan' },
  transports: [
    // Console Output
    new (winston.transports.Console)({
      level   : 'access',
      colorize: true
    }),
    // Daily File Output
    new (winston.transports.DailyRotateFile)({
      filename: __dirname + '/../../log/access.log',
      level   : 'access'
    }),
  ]
});

module.exports.access = accessLogger.access;