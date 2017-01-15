const config  = require('../config');
const mailin  = require('mailin-api-node-js');
const client  = new Mailin("https://api.sendinblue.com/v2.0", config.SENDINBLUE.KEY);
const fs      = require('fs');
const ejs     = require('ejs');
const path    = require('path');
const Promise = require('bluebird');
const Logger  = require('../helpers/log/logger');

/**
 * Render EJS Contents
 * @param template
 * @param data
 * @returns {Promise}
 */
function renderEmail( template, data ) {
  return new Promise(( resolve, reject ) => {
    fs.readFile(__dirname + '/../templates/' + template, ( err, file ) => {
      if ( err ) reject(err);
      resolve(file)
    })
  })
    .then(file => {
      try {
        return Promise.resolve(ejs.render(file.toString(), data));
      }
      catch ( err ) {
        return Promise.reject(err)
      }
    })
}

/**
 *
 * @param title
 * @param email
 * @param template
 * @param renderData
 * @returns {Promise}
 */
function composeEmail( title, email, template, renderData ) {
  return renderEmail(template, renderData)
    .then(( rendered ) => {
      const data = {
        to      : { [email] : email },
        from    : [ config.EMAIL.NO_REPLAY.EMAIL, config.EMAIL.NO_REPLAY.NAME ],
        subject : title,
        html    : rendered
      };

      return new Promise(( resolve, reject ) => {
        client.send_email(data)
          .on('complete', ( data ) => {
            Logger.info('Email sent', data);
            try {
              resolve({ email, data : JSON.parse(data) });
            }
            catch ( err ) {
              reject(err);
            }
          })
          .on('error', err => reject(err))
      })
    });
}

/**
 *
 * @param email
 * @param confirmationToken
 * @returns {Promise}
 */
exports.sendConfirmation = ( email, confirmationToken ) => {

  const template = 'confirmation.ejs';

  const renderData = {
    email,
    confirmationUrl : config.CONFIRMATION_APP_URL + confirmationToken,
    footerText      : ''
  };

  return composeEmail('Confirm your Project account', email, template, renderData);

};

/**
 *
 * @param email
 * @returns {Promise}
 */
exports.sendPasswordChangeNotification = ( email ) => {

  const template = 'generic_notification.ejs';

  const renderData = {
    buttonUrl  : config.APP_URL,
    buttonText : `Go to My Project`,
    mainHeader : `Your password was changed.`,
    subHeader  : `This is a notification, no action is required.`,
    footerText : ''
  };

  return composeEmail('Password change', email, template, renderData);

};

/**
 *
 * @param email
 * @param resetToken
 * @returns {Promise}
 */
exports.sendForgottenPassword = ( email, resetToken ) => {

  const template = 'generic_notification.ejs';

  const renderData = {
    buttonUrl  : config.PASSWORD_RESET_URL + resetToken,
    buttonText : `Reset your password`,
    mainHeader : `To reset your password click on the button below.`,
    subHeader  : `If you didn't request a password reset, ignore this message.`,
    footerText : ''
  };

  return composeEmail('Armbeep forgotten password', email, template, renderData);

};