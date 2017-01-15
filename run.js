const jsdefs       = require('./jsdefs');
const server       = require('./server');
const mongo    = require('./database-mongo');
const postgres = require('./database-postgres');
const ErrorHandler = require('./helpers/response/error');
const Logger       = require('./helpers/log/logger');

function init() {

  mongo.connect()
    .then(postgres.connect())
    .then(server.init)
    .then(( server ) => {

      require('./resources').init(server);

      server.get('*', ( req, res ) => res.status(404).send());

      // Catch any unhandled errors
      server.use(( err, req, res, next ) => {
        if ( err ) ErrorHandler({ req, res }, err, 500);
        else next()
      });
    })
    .catch(err => Logger.error(err));
}

init();