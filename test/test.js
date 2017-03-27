
'use strict'

const test = require('ava')
const P = require('bluebird')
const mock = require('./helpers')
const Nyce = require('../index')
const utils = require('../lib/utils')

test('Successfully parses function signature', (t) => {
  let func
  let asyncFunc
  let sig = utils.parseFuncSig((foo, bar) => {})
  t.is(sig[0], 'foo')
  t.is(sig[1], 'bar')

  sig = []
  sig = utils.parseFuncSig(function(foo, bar) {})
  t.is(sig[0], 'foo')
  t.is(sig[1], 'bar')

  sig = []
  func = (foo, bar) => {}
  sig = utils.parseFuncSig(func)
  t.is(sig[0], 'foo')
  t.is(sig[1], 'bar')
})

test('Successfully define an interface', async t => {
  const testInterface = mock('interface')
  await t.notThrows(Nyce().define('resource', testInterface))
})

test('Fail to redefine an interface', async t => {
  const testInterface = mock('interface')
  const nyce = Nyce()
  let err

  await nyce.define('resource', testInterface)
  err = await t.throws(nyce.define('resource', testInterface))
  t.is(err.message, `You are attempting to redefine interface 'resource'`)
})

test('Successfully force an interface redefinition', async t => {
  const testInterface = mock('interface')
  const nyce = Nyce()
  const forceRedefine = true
  let err

  await nyce.define('resource', testInterface)
  await t.notThrows(nyce.define('resource', testInterface, true))
})

test.serial('Successfully validate a valid interface', async t => {
  const testInterface = mock('interface')
  const testModule = mock('implementation')
  const nyce = Nyce()

  await nyce.define('resource2', testInterface)
  await t.notThrows(nyce.assertImplements('resource2', testModule))
})

test.serial('Throws error when number of arguments dont match', async t => {
  const testInterface = mock('interface')
  const testModule = mock('implementation')
  const nyce = Nyce()
  let err

  testModule.index = (foo) => {}

  await nyce.define('resource3', testInterface)
  err = await t.throws(nyce.assertImplements('resource3', testModule))
  t.is(err.message, 'The number of arguments for function "index" (1) is not the same as expected (2)') // jshint ignore: line
})

test('Validates when arguments don\'t match but no args option is present', async t => {
  const testInterface = mock('interface')
  const testModule = mock('implementation')
  const nyce = Nyce()

  testModule.index = (foo) => {}
  delete testInterface.index.args

  await nyce.define('resource4', testInterface)
  await t.notThrows(nyce.assertImplements('resource4', testModule))
})

test('Successfully throws error when specific arguments dont match', async t => {
  const testInterface = mock('interface')
  const testModule = {
    index: function(foo, boop) {},
    foo: {}
  }
  const nyce = Nyce()
  let err

  testModule.index = (foo, boop) => {} // jshint ignore: line
  testInterface.index.enforceArgNaming = true

  await nyce.define('resource2', testInterface)
  err = await t.throws(nyce.assertImplements('resource2', testModule))
  t.is(err.message, `Signature for function "index" does not match expected "foo,bar" but found "foo,boop"`) // jshint ignore: line
})

test('Successfully ignores unknown props', async t => {
  const testInterface = mock('interface')
  const testModule = {
    index: function( foo, bar ) {},
    foo: {}
  }

  const nyce = Nyce()
  testModule.ignoreMe = (beep) => {} // jshint ignore: line
  await nyce.define('resource5', testInterface)
  await t.notThrows(nyce.check('resource5', testModule))
})

test('Successfully invalidates an invalid interface', async t => {
  const testInterface = mock('interface')
  const testModule = {
    index: function( foo, bar ) {},
    foo: {}
  }
  const nyce = Nyce()
  let err
  // remove a required field from the interface
  delete testModule.foo

  await nyce.define('resource6', testInterface)
  err = await t.throws(nyce.check('resource6', testModule))
  t.is(err.message, 'child "foo" fails because ["foo" is required]')
})
