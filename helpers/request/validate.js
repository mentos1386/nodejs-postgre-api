'use strict';

const _           = require('lodash');
const validator   = require('validator');
const handleError = require('../response/error');

/**
 * Confirm that body holds only the allowed parameters, required parameters and that the parameters are correct type.
 * @param Params
 * @returns {function(*, *, *)}
 */
exports.validate = ( Params ) => {
  return ( req, res, next ) => {

    // Allowed is created from Allowed and Required, you don't have to provide duplicate
    const allowed  = _.union(Params.allowed, Params.required);
    const required = Params.required;

    const body = req.body;

    // Find Illegal Parameters
    const illegalParams = [];

    _.each(body, ( value, _name ) => {
      if ( !_.find(allowed, { name : _name }) ) {
        illegalParams.push(_name);
      }
    });

    // Check for Illegal Parameters
    if ( illegalParams.length ) {
      return handleError({ req, res }, {
        code     : 400,
        messages : _.map(illegalParams, ( param ) => {
          return {
            message : `Param ${param} is illegal`,
            param   : param
          }
        })
      })
    }

    // Find Missing Parameters
    const missingParams = [];

    _.each(required, ( param ) => {
      if ( !_.find(body, ( value, name ) => {
          // Check if there is OR option
          if ( param.or && name !== param.name ) return _.find(body, ( value, orName ) => orName === param.or);
          return name === param.name
        })
      ) {
        missingParams.push(param)
      }
    });

    // Check for Missing Parameters
    if ( missingParams.length ) {
      return handleError({ req, res }, {
        code     : 400,
        messages : _.map(missingParams, ( param ) => {
          return {
            message : `Param ${param.name} is required`,
            param   : param.name,
            or      : param.or
          }
        })
      })
    }

    // Find incorrect type
    const incorrectParams = [];

    _.each(body, ( value, _name ) => {
      let validation = _.find(allowed, { name : _name });
      if ( !validation.type(value) ) {
        incorrectParams.push(_name)
      }
    });

    // Check for Incorrect Parameter types
    if ( incorrectParams.length ) {
      return handleError({ req, res }, {
        code     : 400,
        messages : _.map(incorrectParams, ( name ) => {
          return {
            message : `Param ${name} is incorrect`,
            param   : name,
          }
        })
      })
    }

    // All checks were fine, continue
    next();
  };
};

/**
 * Validation Types
 * @type {{Email: *, String: (*), Date: (*), Number: (*), Array: *}}
 */
exports.types = {
  Email   : validator.isEmail,
  String  : _.isString,
  Date    : validator.isDate,
  Number  : _.isNumber,
  Array   : _.isArray,
  Object  : _.isObject,
  URL     : validator.isURL,
  UUID    : validator.isUUID,
  Boolean : _.isBoolean,
};

/**
 * Check if Type has some specific values. Used for checking if Array has specific types inside
 * @type {{Array: *}}
 */
exports.check = {
  Array : ( type ) => function ( array ) {
    // If type is array, check if request array is any of the items in type array
    if ( _.isArray(type) ) return _.every(array, reqItem => _.some(type, needType => reqItem === needType));
    // If type is a function, pass request array elements to function
    return _.every(array, item => type(item))
  }
};