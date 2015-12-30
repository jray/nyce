
'use strict';

// parse a function's signature
exports.parseFuncSig = ( func ) => {
  const funcStr = func.toString().replace( /\s/g, '' );

  const firstOpeningParenIndex = funcStr.indexOf( '(' );
  const firstClosingParenIndex = funcStr.indexOf( ')' );

  return funcStr
    .substring( firstOpeningParenIndex + 1, firstClosingParenIndex )
    .split( ',' );
};
