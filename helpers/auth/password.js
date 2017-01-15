const argon2 = require('argon2');

exports.generate = ( password ) => {

  return argon2.generateSalt(32)
    .then(salt => argon2.hash(password, salt))

};

exports.compare = ( password, hash ) => {

  return argon2.verify(hash, password)

};