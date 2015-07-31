
'use strict';

var P             = require( 'bluebird' );
var schemaBuilder = require( './lib/schemaBuilder' );
var validate      = require( './lib/validate' );

module.exports = function( ) {

  var _interfaces = {};

  var _api = {

    checkIfImplements: function( type, potentialImpl ) {
      var resolver = P.pending();
      var schema   = _interfaces[ type ];

      if ( schema ) {
        return validate( potentialImpl, schema );
      } else {
        process.nextTick(function(){
          resolver.reject( 'Unknown Type: \'%s\'', type );
        });
      }

      return resolver.promise;
    },

    define: function( name, definition ) {
      var resolver = P.pending();
      var schema;

      if ( _interfaces[ name ] ) {
        resolver.reject(
          'You are attempting to redefine interface \'' + name + '\''
        );
      }

      schema = schemaBuilder( definition );

      _interfaces[ name ] = schema;

      process.nextTick(function(){
        resolver.resolve( schema );
      });

      return resolver.promise;
    }
  };

  return _api;

};
