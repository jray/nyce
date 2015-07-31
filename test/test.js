
'use strict';

var test      = require( 'tape' );
var mock      = require( './mock' );
var nyce      = require( '../index' );
var validate  = require( '../lib/validate' );

test('Successfully define an interface', function( t ) {
  var testInterface = mock( 'interface' );
  nyce()
    .define( 'resource', testInterface )
    .then(function() {
      t.pass();
      t.end();
    })
    .catch(function(e) {
      t.fail( e );
      t.end();
    });
});

test('Fail to redefine an interface', function( t ) {
  var testInterface = mock( 'interface' );
  var foo = nyce();

  foo
    .define( 'resource', testInterface )
    .then(function() {
      return foo
        .define( 'resource', testInterface );
    })
    .catch(function(e) {
      t.pass( e );
      t.end();
    });

});

test('Successfully validate a valid interface', function( t ) {

  t.plan( 1 );

  var testInterface = mock( 'interface' );
  var testModule    = mock( 'implementation' );
  var foo           = nyce();

  foo
    .define( 'resource2', testInterface )
    .then(function( schema ) {
      return foo.checkIfImplements( 'resource2', testModule );
    })
    .then(function( val ) {
      t.ok( val, 'Got val back' );
    })
    .catch(function(e) {
      t.fail( e );
      t.end();
    });

});

test('Successfully invalidates an invalid interface', function( t ) {

  t.plan( 2 );

  var testInterface = mock( 'interface' );
  var testModule    = mock( 'implementation' );
  var foo           = nyce();

  // remove a required field from the interface
  delete testModule.meta;
  testModule.met = {};

  foo
    .define( 'resource3', testInterface )
    .then(function( schema ) {
      return foo.checkIfImplements( 'resource3', testModule );
    })
    .then(function() {
      t.fail( 'Should not have successully validate this module' );
      t.end();
    })
    .catch(function( e ) {
      var msg = 'child "meta" fails because ["meta" is required]';
      t.ok( e, e );
      t.equal( e.message, msg );
    });

});



