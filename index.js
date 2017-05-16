
'use strict'

const component = require('stampit')
const schemaBuilder = require('./lib/schemaBuilder')
const validate = require('./lib/validate')

module.exports = () => {
  return component({
    methods: {
      /**
       * @description Returns all currently defined interface names
       *
       */
      defined () {
        return Array.from(this._interfaces.keys())
      },

      /**
       * @description Determines whether or not an interface with the
       * given name is currently defined
       *
       */
      isDefined (name) {
        return this._interfaces.has(name)
      },

      /**
       * @description Determines whether or not the supplied module implements
       * the interace defined by the given name
       *
       */
      assertImplements (type, potentialImpl) {
        return new Promise((resolve, reject) => {
          const schema = this._interfaces.get(type)
          if (schema) {
            validate(potentialImpl, schema)
              .then((val) => resolve(val))
              .catch((err) => reject(err))
          } else {
            reject(Error(`Unknown Type: '${type}'`))
          }
        })
      },

      /**
       * @description An alias for assertImplements()
       *
       */
      check (type, impl) {
        return this.assertImplements(type, impl)
      },

      /**
       * @description Defines an interface with the given name. If the
       * forceRedefine parameter is set to true, it will overwrite any
       * interface already defined under said name. If not, the promise will
       * be rejected
       *
       */
      define (name, definition, forceRedefine) {
        const self = this
        return new Promise((resolve, reject) => {
          if (this._interfaces.has(name) && !forceRedefine) {
            reject(Error(`You are attempting to redefine interface '${name}'`))
          } else {
            schemaBuilder(definition)
              .then((schema) => {
                self._interfaces.set(name, schema)
                resolve(schema)
              })
              .catch((e) => reject(e))
          }
        })
      } // end define()
    }
  })
  .refs({
    _interfaces: new Map()
  }).create()
}
