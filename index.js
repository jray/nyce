
'use strict'

const P = require('bluebird')
const component = require('stampit')
const schemaBuilder = require('./lib/schemaBuilder')
const validate = require('./lib/validate')

module.exports = () => {

  return component({
    methods: {
      defined() {
        return Object.keys(this._interfaces)
      },

      isDefined(name) {
        return (Object.keys(this._interfaces).indexOf(name) > -1)
      },

      assertImplements(type, potentialImpl) {
        return new Promise((resolve, reject) => {
          const schema = this._interfaces[ type ]
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
          if (this._interfaces[ name ]) {
            reject(Error(`You are attempting to redefine interface '${name}'`))
          } else {
            schemaBuilder(definition)
              .then((schema) => {
                self._interfaces[ name ] = schema
                resolve(schema)
              })
              .catch((e) => reject(e))
          }
        })
      } // end define()
    }
  })
  .refs({
    _interfaces: {}
  }).create()

}
