
'use strict'

// parse a function's signature
exports.parseFuncSig = (func) => {
  const funcStr = func.toString().replace(/\s/g, '')
  const start = funcStr.indexOf('(') + 1
  const stop = funcStr.indexOf(')')

  return funcStr
    .substring(start, stop)
    .split(',')
}
