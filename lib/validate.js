
'use strict';

var P   = require( 'bluebird' );
var joi = require( 'joi' );

module.exports = function( implementation, schema ) {
  var resolver = P.pending();
  var opts = {
    allowUnknown: true
  };

  joi
    .validate( implementation, schema, opts, function( err, val ) {
      if ( err ) {
        resolver.reject( err );
      } else {
        resolver.resolve( val );
      }
    });

  return resolver.promise;
};
