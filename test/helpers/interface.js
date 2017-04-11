
'use strict'

module.exports = (opts) => {
  return {
    index: {
      type: 'function',
      args: [ 'foo', 'bar' ]
    },
    foo: {
      type: 'object'
    }
  }
}
