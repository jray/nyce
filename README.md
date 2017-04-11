
# nyce

[![Circle CI](https://circleci.com/gh/recursivefunk/nyce.png?circle-token=bad6c12dbdb5c68a744e9499c4303029aed34a55)](https://circleci.com/gh/recursivefunk/nyce)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

### JavaScript component interface definition and adherence utility

Component.js

```javascript
exports.index = (foo, bar) => { /* ... */ }
exports.aProp = {}
```

ComponentInterface.js

```javascript
module.exports = {
  index: {
    type: 'function',
    args: [ 'foo', 'bar' ],
    // By default, for function validation, nyce will only check the number
    // of arguments present with no regard to naming. If you would like to
    // fail validation if the names of the function arguments don't match the names
    // of the the interface arguments set this to true
    enforceArgNaming: true
  },
  aProp: {
    type: 'object'
  }
}

```

Elsewhere

```javascript
const nyce = require('nyce')()
const impl = require('./Component')
const interface = require('./ComponentInterface')

nyce
  .define('resource', interface)
  .then(nyce.assertImplements('resource', impl))
  .then(() => {
    console.log( 'yay!' )
  })
  .catch((e) => {
    console.log('oh no!')
  })

```
