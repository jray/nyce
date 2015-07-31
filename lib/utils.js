
'use strict';

// parse a function's signature
exports.parseFuncSig = function( func ) {
  var funcStr = func.toString().replace( /\s/g, '' );

  var firstOpeningParenIndex = funcStr.indexOf( '(' );
  var firstClosingParenIndex = funcStr.indexOf( ')' );

  return funcStr
    .substring( firstOpeningParenIndex + 1, firstClosingParenIndex )
    .split( ',' );
};
