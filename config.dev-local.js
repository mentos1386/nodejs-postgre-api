module.exports = {

  API_URL              : 'http://localhost:3015',
  CONFIRMATION_APP_URL : 'http://localhost:9000/#/confirmation?t=',
  PASSWORD_RESET_URL   : 'http://localhost:9000/#/password-reset?t=',
  APP_URL              : 'http://localhost:9000/#/',
  API_V1_PREFIX        : '/api/v1',
  PORT                 : 3015,
  SENDINBLUE           : {
    KEY : 'sendinblueKey'
  },
  DB                   : {
    MONGO    : {
      NAME : 'project-api-db',
      HOST : 'localhost'
    },
    POSTGRES : {
      DB   : 'maverick-api-db',
      HOST : 'localhost',
      USER : 'username',
      PASS : null
    }
  },
  EMAIL                : {
    NO_REPLAY : {
      NAME  : 'My Project',
      EMAIL : 'no-replay@my.project'
    },
  },
};