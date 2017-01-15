/**
 * @typedef {Object} Account
 * @property {String} id Mongoose id
 * @property {String} email Email
 * @property {String} recoveryEmail Recovery Email
 * @property {String} name Name
 * @property {String} surname Surname
 * @property {String} confirmationToken Token generated when user registers
 * @property {String} resetToken Token generated when user requests password reset
 */

/**
 * @typedef {Object} ReqPostAccount
 * @property {String} email Account email
 * @property {String} name Name
 * @property {String} surname Surname
 * @property {String} password Account password in plain text
 * @property {String} token Account registration token
 */