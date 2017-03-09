
'use strict';

module.exports = function( type, opts ) {
  if ( type === 'interface' ) {
    return require( './interface' )( opts );
  } else {
    return require( './implementation' );
  }
};
