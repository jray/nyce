
'use strict'

const P = require('bluebird')
const joi = require('joi')
const utils = require('./utils')
const errors = require('./errors')

module.exports = (implementation, schema) => {
  return new P((resolve, reject) => {
    const opts = {
      allowUnknown: true
    }

    const ret = checkFunctions(implementation, schema)

    if (!ret.ok) {
      process.nextTick(() => reject(Error(ret.message)))
    } else {
      validate(implementation, schema, opts)
        .then(val => resolve(val))
        .catch(err => reject(err))
    }
  })
}

function validate(impl, schema, opts) {
  return new P((resolve, reject) => {
    joi.validate(impl, schema, opts, (err, val) => {
      if (err) return reject(err)
      resolve(val)
    })
  })
}

/**
 * Does some funky joi object parsing and parses the function signature to
 * extract parameter names
 *
 */
function checkFunctions(impl, schema) {
  const children = schema.describe().children
  const ret = { ok: true }
  for(let i in children) {
    if (impl.hasOwnProperty(i) && children.hasOwnProperty(i)) {
      if (children[ i ].flags && children[ i ].flags.func === true) {
        const func = impl[ i ]
        const funcSig = utils.parseFuncSig(func)
        let enforceNaming
        let expectedArgs

        if (children[ i ].meta) {
          enforceNaming = children[ i ].meta[ 0 ].enforceArgNaming
          expectedArgs = children[ i ].meta[ 0 ].args

          if (!sameArray(funcSig, expectedArgs)) {
            ret.ok = false
            ret.message = errors.invalidSignature(i, expectedArgs, funcSig)
          }

          if (funcSig.length !== expectedArgs.length) {
            ret.ok = false
            ret.message = errors
              .unexpectedArgsLength(i, expectedArgs.length, funcSig.length)
          }
        } else {
          if (typeof impl[ i ] !== 'function') {
            ret.ok = false
            ret.message = `Property '${i}' is not a function!`
          }
        }

        if (!ret.ok) {
          return ret
        }
      }
    }
  }
  return ret
}

function sameArray(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false
  }
  return arr1.every((item, index) => item === arr2[index])
}
