'use strict';

const config = require('../../config');

const _ = require('lodash');

const responseHandler = require('../../helpers/response/success');
const errorHandler    = require('../../helpers/response/error');
const Logger          = require('../../helpers/log/logger.js');
const Promise         = require('bluebird');

const {NAME}Service = require('./{NAME}-service');

const {Name}Model = require('../../resources').{NAME};

/**
 * Get specific {NAME}
 */
exports.CRUDGet = ( req, res ) => {
  {Name}Model.findById(req.params.{NAME}Id)
    .then({NAME} => {NAME} ? {NAME} : Promise.reject('{Name} not found'))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Create {NAME}
 */
exports.CRUDCreate = ( req, res ) => {
  {Name}Service.create{NAME}(req.body)
    .then({NAME} => {NAME}.setCreatedBy(req.account))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Update {NAME}
 */
exports.CRUDUpdate = ( req, res ) => {
  {Name}Model.findById(req.params.{NAME}Id)
    .then({NAME} => {NAME} ? {NAME} : Promise.reject('{Name} not found'))
    .then({NAME} => {NAME}.setUpdatedBy(req.account))
    .then({NAME} => {NAME}Service.update{NAME}(req.body, {NAME}))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Delete {NAME}
 */
exports.CRUDDelete = ( req, res ) => {
  {Name}Model.findById(req.params.offerId)
    .then({NAME} => {NAME} ? {NAME} : Promise.reject('{Name} not found'))
    .then({NAME} => {NAME}Service.delete{NAME}({NAME}))
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err, 400))
};

/**
 * Get list of {NAME}s
 */
exports.getList = ( req, res ) => {
  const page   = req.query.page || 0;
  const limit  = req.query.limit || 20;
  const offset = page * limit;

  {Name}Model.findAll({ limit, offset })
    .then(response => responseHandler(res, response))
    .catch(err => errorHandler({ req, res }, err))
};