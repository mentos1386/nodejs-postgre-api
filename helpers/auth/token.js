const randToken = require('rand-token');

exports.getAccessToken = () => {

  return randToken.generate(255);

};