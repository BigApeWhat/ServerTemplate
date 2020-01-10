const UNKNOWN_ERROR = 'UKNOWN ERROR';

function chuck(msg) {
  // Applications will distinguish between operational and programmer
  // errors by checking for an error of type ServiceError. For that
  // reason, if we encounter an error simply CREATING this error, we must
  // throw something that doesn't have this error's prototype for example,
  // just a regular old Error.
  throw new Error(msg);
}

function fixStack(err) {
  const s = err.stack.split('\n');
  s[0] = `ServiceError: ${err.toString()}`;
  err.stack = s.join('\n'); // eslint-disable-line no-param-reassign
}

/**
 * @constructor
 * @param {Error} cause - upstream error that caused this error
 * @param {String} message - contextualized message
 * @param {Number} status - status code
 */
module.exports = function ServiceError() {

  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;

  // No params: programmer error
  if (arguments.length === 0 || arguments.length > 3) {
    chuck('Must provide cause, message, or status');
  }

  // Status only: programmer error
  if (arguments.length === 1
    && typeof (arguments[0]) === 'number') {
    chuck('Cannot provide status alone'); // TODO: better msg
  }

  // Cause, message, status
  if (arguments.length === 3
    && arguments[0] instanceof Error
    && typeof (arguments[1]) === 'string'
    && typeof (arguments[2]) === 'number') {
    this.cause = arguments[0];
    this.message = arguments[1];
    this.status = arguments[2];
    fixStack(this);
    return;
  }

  // Message, status, type
  if (arguments.length === 3
    && typeof (arguments[0]) === 'string'
    && typeof (arguments[1]) === 'number'
    && typeof (arguments[2]) === 'string') {
    this.message = arguments[0];
    this.status = arguments[1];
    this.type = arguments[2];
    fixStack(this);
    return;
  }

  // Cause, message
  if (arguments.length === 2
    && arguments[0] instanceof Error
    && typeof (arguments[1]) === 'string') {
    this.cause = arguments[0];
    this.message = arguments[1];
    fixStack(this);
    return;
  }

  // Cause, status
  if (arguments.length === 2
    && arguments[0] instanceof Error
    && typeof (arguments[1]) === 'number') {
    this.cause = arguments[0];
    this.message = UNKNOWN_ERROR;
    this.status = arguments[1];
    fixStack(this);
    return;
  }

  // Message, status
  if (arguments.length === 2
    && typeof (arguments[0]) === 'string'
    && typeof (arguments[1]) === 'number') {
    this.message = arguments[0];
    this.status = arguments[1];
    fixStack(this);
    return;
  }

  // Cause
  if (arguments.length === 1
    && arguments[0] instanceof Error) {
    this.cause = arguments[0];
    this.message = UNKNOWN_ERROR;
    fixStack(this);
    return;
  }

  // Message
  if (arguments.length === 1
    && typeof (arguments[0]) === 'string') {
    this.message = arguments[0];
    fixStack(this);
    return;
  }

  // Invalid parameters to constructor: programmer error
  chuck('UNEXPECTED ERROR: Unsupported parameter combination.');
};

require('util').inherits(module.exports, Error);

module.exports.prototype.toString = function toString() {
  if (this.cause) {
    return `${this.message}: ${this.cause.toString()}`;
  }
  return this.message;
};

function makeJson(err) {
  const result = {};
  Object.assign(result, err);
  if (err.cause) {
    result.cause = makeJson(err.cause); // Recurse
  }
  return result;
}

module.exports.prototype.toJSON = function toJSON() {
  return makeJson(this);
};