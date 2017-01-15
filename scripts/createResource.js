'use strict';
const _       = require('lodash');
const Promise = require('bluebird');
const ncp     = Promise.promisify(require('ncp').ncp);
const mkdir   = Promise.promisify(require('fs').mkdir);
const rename  = Promise.promisify(require('fs').rename);
const readdir = Promise.promisify(require('fs').readdir);
const replace = require('replace');

const exec = require('child_process').exec;

new Promise.resolve()
  .then(() => process.argv.slice(2) ? process.argv.slice(2)[ 0 ] : Promise.reject("Missing parameters"))
  .then(( resource ) => {
    const uppercaseResource = resource.charAt(0).toUpperCase() + resource.slice(1);
    return mkdir(`./scripts/${resource}`)
      .then(() => ncp('./scripts/resourceTemplates', `./scripts/${resource}`))
      .then(() => replace({
        regex       : "{NAME}",
        replacement : resource,
        paths       : [ `./scripts/${resource}` ],
        recursive   : true,
      }))
      .then(() => replace({
        regex       : "{Name}",
        replacement : uppercaseResource,
        paths       : [ `./scripts/${resource}` ],
        recursive   : true,
      }))
      .then(() => readdir(`./scripts/${resource}/`))
      .then(folders => Promise.map(folders,
        folder => rename(`./scripts/${resource}/${folder}`,
          `./scripts/${resource}/${folder.replace('name', resource)}`)))
      .then(() => ncp(`./scripts/${resource}`, `./resources/${resource}`))
      .then(() => {
        return new Promise(( resolve, reject ) => {
          exec(`rm -r ./scripts/${resource}/`, ( err ) => {
            if ( err ) return reject(err);
            return resolve()
          })
        })
      })
  })
  .catch(err => {
    console.log(err);
    process.exit(1)
  });