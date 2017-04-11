
'use strict'

module.exports = (type, opts) => {
  if (type === 'interface') {
    return require('./interface')(opts)
  } else {
    return require('./implementation')
  }
}
