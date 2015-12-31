
'use strict';

exports.invalidSignature = (funcName, expected, actual) => {
  return `Signature for function "${funcName}" does not match expected "${expected}" but found "${actual}"`;
};

exports.unexpectedArgsLength = (funcName, expectedLength, actualLength) => {
  return `The number of arguments for function "${funcName}" (${actualLength}) is not the same as expected (${expectedLength})`;
};
