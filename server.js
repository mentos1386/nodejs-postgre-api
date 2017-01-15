const express          = require('express');
const server           = express();
const bodyParser       = require('body-parser');
const auth             = require('./helpers/auth/middleware');
const cors             = require('cors');
const cfg              = require('./config');
const errorHandler = require('./helpers/response/error');
const logger       = require('./helpers/log/logger');

server.use(bodyParser.json());
server.use(cors());
server.use(bodyParser.urlencoded({ extended: true }));

// Catch any BodyParser errors (malformed Json etc.)
server.use((err, req, res, next) => {
  if (err) errorHandler({ req, res }, err, 400);
  else next()
});

exports.init = () => {
  server.listen(cfg.PORT, '0.0.0.0', () => logger.log('info', `Server running on port ${cfg.PORT}`));
  return server;
};
