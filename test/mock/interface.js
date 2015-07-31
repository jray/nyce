

'use strict';

module.exports = function( opts ) {
  return {
    index: {
      required: true,
      type: 'function',
      args: [ 'foo', 'bar' ]
    },
    meta: {
      required: true,
      type: 'object'
    }
  };
};

