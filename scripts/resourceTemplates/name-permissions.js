const config = require('../../config');

module.exports = exports = [
  {
    prefix : config.API_V1_PREFIX,
    path   : '/{NAME}s(/:{NAME}Id)',
    roles  : [
      {
        type    : '*',
        methods : [ 'get', 'post', 'delete' ]
      }
    ]
  },
  {
    prefix : config.API_V1_PREFIX,
    path   : '/{NAME}s',
    roles  : [
      {
        type    : '*',
        methods : [ 'get', 'post' ]
      }
    ]
  },
];
