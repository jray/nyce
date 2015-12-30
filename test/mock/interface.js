

'use strict';

module.exports = function( opts ) {
  return {
    index: {
      type: 'function',
      args: [ 'foo', 'bar' ]
    },
    foo: {
      type: 'object'
    }
  };
};

