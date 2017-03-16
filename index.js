
'use strict'

const P = require('bluebird')
const component = require('stampit')
const schemaBuilder = require('./lib/schemaBuilder')
const validate = require('./lib/validate')

module.exports = () => {

  return component({
    methods: {

      defined() {
        return Array.from(this._interfaces.keys())
      },

      isDefined(name) {
        return this._interfaces.has(name)
      },

      assertImplements(type, potentialImpl) {
        return new Promise((resolve, reject) => {
          const schema = this._interfaces.get(type)
          if (schema) {
            validate(potentialImpl, schema)
              .then((val) => resolve(val))
              .catch((err) => reject(err))
          } else {
            reject(`Unknown Type: '${type}'`)
          }
        })
      },

      check(type, impl) {
        return this.assertImplements(type, impl)
      },

      define(name, definition) {
        const self = this
        return new Promise((resolve, reject) => {
          if (this._interfaces.has(name)) {
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
