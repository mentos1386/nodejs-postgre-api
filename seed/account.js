const faker          = require('faker');
const AccountService = require('../resources/account/account-service');

module.exports = () => {
  return AccountService.createAccount({
    email     : faker.internet.email(),
    firstName : faker.name.firstName(),
    lastName  : faker.name.lastName(),
    password  : 'password',
  });
};