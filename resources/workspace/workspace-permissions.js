const config = require('../../config');

module.exports = exports = [
  {
    prefix : config.API_V1_PREFIX,
    path   : '/workspaces(/:workspaceId)/account',
    roles  : [
      {
        type    : '*',
        methods : [ 'post' ]
      }
    ]
  },
  {
    prefix : config.API_V1_PREFIX,
    path   : '/workspaces',
    roles  : [
      {
        type    : '*',
        methods : [ 'get', 'post' ]
      }
    ]
  }
];
