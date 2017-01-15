const config = require('../../config');

module.exports = exports = [
  {
    prefix : config.API_V1_PREFIX,
    path   : '/account/logout',
    roles  : [
      {
        type    : '*',
        methods : [ 'get' ]
      }
    ]
  },
  {
    prefix : config.API_V1_PREFIX,
    path   : '/account/checkLogin',
    roles  : [
      {
        type    : '*',
        methods : [ 'get' ]
      }
    ]
  },
  {
    prefix : config.API_V1_PREFIX,
    path   : '/accounts(/:accountId)',
    roles  : [
      {
        type    : '*',
        methods : [ 'get', 'post' ]
      }
    ]
  },
  {
    prefix : config.API_V1_PREFIX,
    path   : '/accounts',
    roles  : [
      {
        type    : '*',
        methods : [ 'get', 'post' ]
      }
    ]
  },
];
