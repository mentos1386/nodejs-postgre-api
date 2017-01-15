'use strict';
const randToken     = require('rand-token');
const bcrypt        = require('bcrypt');
const Promise       = require('bluebird');
const {NAME}Model = require('../../resources').{NAME};
const _             = require('lodash');

/**
 * Create new {NAME}
 * @param {NAME}Object
 * @returns {Promise}
 */
exports.create{NAME} = ( {NAME}Object ) => {

  return {NAME}Model.create({NAME}Object)

};

/**
 * Update {NAME}
 * @param {NAME}Object
 * @param {NAME}Model
 * @returns {Promise}
 */
exports.update{NAME} = ( {NAME}Object, {NAME}Model ) => {

  return {NAME}Model.update({NAME}Object)

};

/**
 * Delete {NAME}
 * @param {NAME}Model
 * @returns {Promise}
 */
exports.delete{NAME} = ( {NAME}Model ) => {
  return {NAME}Model.destroy()
    .then(() => {
      return { message : '{NAME} Deleted' }
    })
};

/**
 * Format Proper response
 * @param {NAME}Model
 * @returns {Promise}
 */
exports.makeResponse = ( {NAME}Model ) => {

  // TODO: Write Response Formater

  return Promise.resolve({
    id: {NAME}Model.id
  });

};