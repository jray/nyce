
'use strict';

const test = require('tape');
const mock = require('./mock');
const Nyce = require('../index');
const utils = require('../lib/utils');

test('Successfully parses function signature', (t) => {
  const sig = utils.parseFuncSig((foo, bar) => {});
  t.equal(sig[0], 'foo');
  t.equal(sig[1], 'bar');
  t.end();
});

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
      return nyce.assertImplements('resource2', testModule);
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
    .define('resource3', testInterface)
    .then(() => {
      return nyce.assertImplements('resource3', testModule);
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

test('Successfully validates when arguments dont match but no args option is present', (t) => {

  t.plan(1);

  const testInterface = mock('interface');
  const testModule = mock('implementation');
  const nyce = Nyce();

  testModule.index = (foo) => {};
  delete testInterface.index.args;

  nyce
    .define('resource4', testInterface)
    .then(() => {
      return nyce.assertImplements('resource4', testModule);
    })
    .then(() => {
      t.pass('validation should succeed because we ignore arguments.');
      t.end();
    })
    .catch((e) => {
      t.fail(e.message);
      t.end();
    });
});

test('Successfully throws error when specific arguments dont match', (t) => {

  t.plan(2);

  const testInterface = mock('interface');
  const testModule = {
    index: function(foo, boop) {},
    foo: {}
  };
  const nyce = Nyce();

  testModule.index = (foo, boop) => {}; // jshint ignore: line
  testInterface.index.enforceArgNaming = true;

  nyce
    .define('resource2', testInterface)
    .then(() => {
      return nyce.assertImplements('resource2', testModule);
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

test('Successfully ignores unknown props', (t) => {

  t.plan(1);

  const testInterface = mock('interface');
  const testModule = {
    index: function( foo, bar ) {},
    foo: {}
  };

  const nyce = Nyce();
  testModule.ignoreMe = (beep) => {}; // jshint ignore: line

  nyce
    .define('resource5', testInterface)
    .then(() => {
      return nyce.assertImplements('resource5', testModule);
    })
    .then(() => {
      t.pass('validation was valid when unknown properties exist.');
      t.end();
    })
    .catch((e) => {
      t.fail(e.message);
      t.end();
    });
});

test('Successfully invalidates an invalid interface', (t) => {

  t.plan(2);

  const testInterface = mock('interface');
  const testModule = {
    index: function( foo, bar ) {},
    foo: {}
  };
  const nyce = Nyce();
  // remove a required field from the interface
  delete testModule.foo;

  nyce
    .define('resource6', testInterface)
    .then(() => {
      return nyce.assertImplements('resource6', testModule);
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



