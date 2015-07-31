
# nyce

### Component interface definition utility

```javascript
var nyce        = require( 'nyce' )();
var someModule  = require( './lib/foo' );

var myInterface = {
  index: {
    required: true,
    type: 'function',
    args: [ 'foo', 'bar' ]
  },
  aProp: {
    required: true,
    type: 'object'
  }
};

nyce
  .define( 'resource', myInterface )
  .then( nyce.checkIfImplements( 'resource', someModule ) )
  .then(function() {
    console.log( 'yay!' );
  })
  .catch(function( e ) {
    console.log('oh no!')
  })

```
