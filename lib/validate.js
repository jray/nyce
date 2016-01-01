
'use strict';

const P = require('bluebird');
const joi = require('joi');
const utils = require('./utils');
const errors = require('./errors');

module.exports = (implementation, schema) => {
  const resolver = P.pending();
  const opts = {
    allowUnknown: true
  };

  const ret = checkFunctions(implementation, schema);

  if (!ret.ok) {
    process.nextTick(() => resolver.reject(new Error(ret.message)));
  } else {
    joi.validate(implementation, schema, opts, function(err, val) {
      if (err) {
        resolver.reject(err);
      } else {
        resolver.resolve(val);
      }
    });
  }

  return resolver.promise;
};

function checkFunctions(impl, schema) {
  const children = schema.describe().children;
  const ret = { ok: true };
  for(let i in children) {
    if (impl.hasOwnProperty(i) && children.hasOwnProperty(i)) {
      if (children[ i ].flags && children[ i ].flags.func === true) {
        const func = impl[ i ];
        const funcSig = utils.parseFuncSig(func);
        let enforceNaming;
        let expectedArgs;

        if (children[ i ].meta) {
          enforceNaming = children[ i ].meta[ 0 ].enforceArgNaming;
          expectedArgs = children[ i ].meta[ 0 ].args;

          if (!sameArray(funcSig, expectedArgs)) {
            ret.ok = false;
            ret.message = errors.invalidSignature(i, expectedArgs, funcSig);
          }

          if (funcSig.length !== expectedArgs.length) {
            ret.ok = false;
            ret.message = errors
              .unexpectedArgsLength(i, expectedArgs.length, funcSig.length);
          }
        } else {
          if (typeof impl[ i ] !== 'function') {
            ret.ok = false;
            ret.message = `Property '${i}' is not a function!`;
          }
        }

        if (!ret.ok) {
          return ret;
        }
      }
    }
  }
  return ret;
}

function sameArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false;
  }
  return arr1.every((item, index) => item === arr2[index]);
}
