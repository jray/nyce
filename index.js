
'use strict';

const P = require('bluebird');
const component = require('stampit');
const schemaBuilder = require('./lib/schemaBuilder');
const validate = require('./lib/validate');

module.exports = () => {

  return component({
    methods: {
      defined() {
        return Object.keys(this._interfaces);
      },

      isDefined(name) {
        return (Object.keys(this._interfaces).indexOf(name) > -1);
      },

      assertImplements(type, potentialImpl) {
        const resolver = P.pending();
        const schema = this._interfaces[ type ];

        if (schema) {
          return validate(potentialImpl, schema);
        } else {
          process.nextTick(() => resolver.reject(`Unknown Type: '${type}'`));
        }
        return resolver.promise;
      },

      define(name, definition) {
        const self = this;
        const resolver = P.pending();

        if (this._interfaces[ name ]) {
          process.nextTick(() => {
            resolver.reject(
              `You are attempting to redefine interface '${name}'`
            );
          });
        } else {
          schemaBuilder(definition)
            .then((schema) => {
              self._interfaces[ name ] = schema;
              resolver.resolve(schema);
            })
            .catch((e) => resolver.reject(e));
        }
        return resolver.promise;
      }
    }
  })
  .refs({
    _interfaces: {}
  }).create();

};
