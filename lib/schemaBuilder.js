
'use strict'

const joi = require('joi');
const P = require('bluebird');

const _fetchJoiChain = (objDef) => {

  let type = objDef.type;
  let joiObj;

  if (type === 'function') {
    type = 'func';
    joiObj = joi.func();
  } else {
    joiObj = joi[ type ].apply(joi);
  }

  if (objDef.args) {
    let meta = { args: objDef.args };
    if (objDef.enforceArgNaming) {
      meta.enforceArgNaming = true;
    }
    joiObj = joiObj.meta(meta);
  }

  joiObj = joiObj.required();

  return joiObj;
};

const _hasRequiredProps = (obj) => {
  return (!obj.hasOwnProperty('type'));
};

module.exports = function(obj) {
  const resolver = P.pending();
  const keys = Object.keys(obj)
    .reduce((prev, name) => {
      let ret = prev;
      if (!_hasRequiredProps(obj)) {
        const err = `Required property: 'type' not found.`;
        process.nextTick(() => resolver.reject(err));
      } else {
        ret[ name ] = _fetchJoiChain(obj[ name ]);
        return ret;
      }
    }, {});

  const schema = joi.object().keys(keys);
  process.nextTick(() => resolver.resolve(schema));
  return resolver.promise;

};
