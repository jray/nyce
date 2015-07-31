
'use strict';

var joi = require( 'joi' );
var P   = require( 'bluebird' );

var _fetchJoiChain = function( objDef ) {

  var type = objDef.type;
  var joiObj;
  if ( type === 'function' ) {
    type = 'func';
  }
  joiObj = joi[ type ].apply( joi );

  if ( objDef.required ) {
    joiObj = joiObj.required();
  }

  if ( objDef.args ) {
    joiObj = joiObj.meta( { args: objDef.args } );
  }

  return joiObj;
};

var _hasRequiredProps = function( obj ) {
  return (
    !obj.hasOwnProperty( 'type' )
  );
};

module.exports = function( obj ) {

  var i;
  var name;
  var val;
  var key;
  var schema;
  var keys = {};

  for ( i in obj ) {

    if ( !_hasRequiredProps( obj ) ) {
      return false;
    }

    name  = i;
    val   = obj[ name ];
    key   = _fetchJoiChain( obj[ i ] );

    // add to known keys
    keys[ name ] = key;

  } // end for loop

  schema = joi.object().keys( keys );

  return schema;

};
