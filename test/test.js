
'use strict';

const test = require('tape');
const mock = require('./mock');
const Nyce = require('../index');
const validate = require('../lib/validate');
const utils = require('../lib/utils');

test('Successfully parses function signature', (t) => {
  const sig = utils.parseFuncSig((foo, bar) => {});
  t.end();
})

test('Successfully define an interface', (t) => {
  const testInterface = mock('interface');
  Nyce()
    .define('resource', testInterface)
    .then(() => {
      t.pass('define resource executes successfully');
      t.end();
    })
    .catch((e) => {
      t.fail(e.message);
      t.end();
    });
});

test('Fail to redefine an interface', (t) => {
  const testInterface = mock('interface');
  const nyce = Nyce();

  nyce
    .define('resource', testInterface)
    .then(() => {
      return nyce.define('resource', testInterface);
    })
    .then(() => {
      t.fail('redefining interfaces should fail I shouldn\'t be here.');
    })
    .catch((e) => {
      t.pass(e);
      t.end();
    });

});

test('Successfully validate a valid interface', (t) => {

  t.plan(1);

  const testInterface = mock('interface');
  const testModule = mock('implementation');
  const nyce = Nyce();

  nyce
    .define('resource2', testInterface)
    .then(() => {
      return nyce.checkIfImplements('resource2', testModule);
    })
    .then((val) => {
      t.ok(val, 'Got val back');
    })
    .catch((e) => {
      t.fail(e.message);
      t.end();
    });

});

test('Successfully throws error when number of arguments dont match', (t) => {

  t.plan(2);

  const testInterface = mock('interface');
  const testModule = mock('implementation');
  const nyce = Nyce();

  testModule.index = (foo) => {};

  nyce
    .define('resource2', testInterface)
    .then(() => {
      return nyce.checkIfImplements('resource2', testModule);
    })
    .then(() => {
      t.fail('validation should fail I shouldnt be here.');
      t.end();
    })
    .catch((e) => {
      t.ok(e);
      t.equal(e.message, 'The number of arguments for function "index" (1) is not the same as expected (2)'); // jshint ignore: line
      t.end();
    });
});

test('Successfully throws error when specific arguments dont match', (t) => {

  t.plan(2);

  const testInterface = mock('interface');
  const testModule = mock('implementation');
  const nyce = Nyce();

  testModule.index = (foo, boop) => {}; // jshint ignore: line
  testInterface.index.enforceArgNaming = true;

  nyce
    .define('resource2', testInterface)
    .then(() => {
      return nyce.checkIfImplements('resource2', testModule);
    })
    .then(() => {
      t.fail('validation should fail I shouldnt be here.');
      t.end();
    })
    .catch((e) => {
      t.ok(e);
      t.equal(e.message, `Signature for function "index" does not match expected "foo,bar" but found "foo,boop"`); // jshint ignore: line
      t.end();
    });
});

test('Successfully invalidates an invalid interface', (t) => {

  t.plan(2);

  const testInterface = mock('interface');
  const testModule = mock('implementation');
  const nyce = Nyce();
  // remove a required field from the interface
  delete testModule.foo;

  nyce
    .define('resource3', testInterface)
    .then((schema) => {
      return nyce.checkIfImplements('resource3', testModule);
    })
    .then(() => {
      t.fail('Should not have successully validate this module');
      t.end();
    })
    .catch((e) => {
      const msg = 'child "foo" fails because ["foo" is required]';
      t.ok(e, e);
      t.equal(e.message, msg);
      t.end();
    });

});



