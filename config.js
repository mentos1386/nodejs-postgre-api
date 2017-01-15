'use strict';

let config;

if ( process.env.NODE_ENV === 'production' ) {
  console.log('Production environment set');
  config = require('./config.prod');
}
else if ( process.env.NODE_ENV === 'staging' ) {
  console.log('Staging environment set');
  config = require('./config.staging');
}
else if ( process.env.NODE_ENV === 'development' && process.env.DEV === 'local' ) {
  console.log('Local Development environment set');
  config = require('./config.dev-local');
}
else if ( process.env.NODE_ENV === 'development' ) {
  console.log('Development environment set');
  config = require('./config.dev');
}
else {
  throw new Error('Missing environment NODE_ENV');
}

module.exports = config;