'use strict';
const mongo    = require('./database-mongo');
const postgres = require('./database-postgres');

/**
 *  Use command like this:
 *    >  npm run seed account 1 something 10
 *    >  npm run seed-local account 1 something 10
 *
 * @param args
 */
function seed( args ) {
  mongo.connect()
    .then(() => postgres.connect())
    .then(() => require('./resources').init())
    .then(() => require('require-all')({
      dirname     : __dirname + '/seed/',
      filter      : /(.+)\.js$/,
      excludeDirs : /^\.(git|svn)$/,
      recursive   : true
    }))
    .then(( seeds ) => Promise.each(args, ( arg, index ) => {
      // If argument isn't number and isn't part of seeds models, return unknown model name
      if ( isNaN(arg) && !seeds[ arg ] ) return Promise.reject(`Unknown Model name "${arg}"`);
      else if ( isNaN(arg) ) {
        const next = index + 1;
        // If next model is number, use number to make that n of models
        if ( !isNaN(args[ next ]) ) {
          let seedsPromises = [];
          for ( let i = 0; i < args[ next ]; i++ ) {
            seedsPromises.push(seeds[ arg ]())
          }
          return Promise.all(seedsPromises)
        }
        else return seeds[ arg ]()
      }
    }))
    .then(results => console.log('Done', results.length))
    .then(() => process.exit())
    .catch(err => console.log('ERR', err))
}

seed(process.argv.slice(2));