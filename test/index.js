var assert = require('assert');
var trample = require('..');
var getLeaf = trample.flattenUntilArrayLeaf;

describe('flatten array leaf', function() {
  it('should return leaf node', function() {
    var res = getLeaf(null, {
      input: ['Hello', 'World'],
      options: { flattenArray: false }
    });

    assert.deepEqual(res, ['Hello', 'World']);
  });

  it('should flatten leaf nodes including array', function() {
    var res = getLeaf(null, {
      input: ['Hello', 'World'],
      options: { flattenArray: true }
    });

    assert(!(res instanceof Array));
    assert.deepEqual(res, { '0': 'Hello', '1': 'World' });
  });

  it('should not flatten the leaf nodes (array)', function() {
    var res = getLeaf(null, {
      input: ['Hello', ['Foobar']],
      options: { flattenArray: false }
    });

    assert(!(res instanceof Array));
    assert.deepEqual(res, {
      '0': 'Hello',
      '1': ['Foobar']
    });
  });

  it('should flatten until leaf node array', function() {
    var res = getLeaf(null, {
      input: ['Hello', ['Foobar', ['Big']]],
      options: { flattenArray: false }
    });

    assert(!(res instanceof Array));
    assert.deepEqual(res, {
      '0': 'Hello',
      '1.0': 'Foobar',
      '1.1': ['Big']
    });
  });

  it('should flatten deep nested arrays', function() {
    var res = getLeaf(null, {
      input: ['Hello', ['Foobar', ['Big']]],
      options: { flattenArray: true }
    });

    assert(!(res instanceof Array));
    assert.deepEqual(res, {
      '0': 'Hello',
      '1.0': 'Foobar',
      '1.1.0': 'Big'
    });
  });

  it('should flatten everything', function() {
    var res = getLeaf(null, {
      input: ['Hello', ['Foobar']],
      options: { flattenArray: true }
    });

    assert(!(res instanceof Array));
    assert.deepEqual(res, {
      '0': 'Hello',
      '1.0': 'Foobar'
    });
  });

  it('should flatten parent array with child object.', function() {
    var res = getLeaf(null, {
      input: [{
        foo: { bar: 123 }
      }],
      options: { flattenArray: false }
    });

    assert.deepEqual(res, {
      '0.foo.bar': 123
    });
  });
});

describe('trample', function() {
  it('should return a function', function() {
    assert.equal('function', typeof trample);
  });

  it('should not trample flattened object', function() {
    var obj = {
      'foobar': 123,
      'cat': 'dog'
    };

    var res = trample(obj);

    assert.equal(res.foobar, 123);
    assert.equal(res.cat, 'dog');
  });

  it('should flatten object', function() {
    var obj = {
      'foobar123': {
        'cat': 123
      }
    };

    var res = trample(obj);
    assert.equal(res['foobar123.cat'], 123);
  });

  it('should flatten complex object', function() {
    var obj = {
      products: [
        { orderId: 75 },
        { orderId: 32 }
      ],
      foo: {
        bar: ['Hello', 'World']
      },
      address: {
        state: {
          a: 'ca',
          b: 'sf'
        },
        cat: [
          { name: 'John Doe' }
        ]
      }
    };

    var res = trample(obj);

    assert.equal(res['products.0.orderId'], 75);
    assert.equal(res['products.1.orderId'], 32);

    assert.equal(res['foo.bar'][0], 'Hello');
    assert.equal(res['foo.bar'][1], 'World');

    assert.equal(res['address.state.a'], 'ca');
    assert.equal(res['address.state.b'], 'sf');
    assert.equal(res['address.cat.0.name'], 'John Doe');
  });

  it('should flatten complex object w/ tags', function() {
    var obj = {
      products: [
        {
          orderId: 75, tags: ['one', 'two'],
          foo: {
            bar: 123
          }
        },
        { orderId: 32 }
      ],
    };

    var res = trample(obj);

    assert.equal(res['products.0.orderId'], 75);
    assert.equal(res['products.0.tags'][0], 'one');
    assert.equal(res['products.0.tags'][1], 'two');
    assert.equal(res['products.1.orderId'], 32);
  });

  it('should flatten complex object w/ tags w/ flatten array', function() {
    var obj = {
      products: [
        {
          orderId: 75,
          tags: ['one', 'two']
        },
        { orderId: 32 }
      ],
    };

    var res = trample(obj, { flattenArray: true });

    assert.equal(res['products.0.orderId'], 75);
    assert.equal(res['products.0.tags.0'], 'one');
    assert.equal(res['products.0.tags.1'], 'two');
    assert.equal(res['products.1.orderId'], 32);
  });

  it('should flatten complex object w/ tags w/ flatten array 123', function() {
    var obj = {
      products: [
        { orderId: { foobar: 123 }, tags: ['one', 'two'] }
      ],
    };

    var res = trample(obj, { flattenArray: true });

    assert.equal(res['products.0.orderId.foobar'], 123);
    assert.equal(res['products.0.tags.0'], 'one');
    assert.equal(res['products.0.tags.1'], 'two');
  });

  it('should flatten complex object including arrays', function() {
    var obj = {
      products: [
        { orderId: 75 },
        { orderId: 32 }
      ],
      foo: {
        bar: ['Hello', 'World']
      },
      address: {
        state: {
          a: 'ca',
          b: 'sf'
        },
        cat: [
          { name: 'John Doe' }
        ]
      }
    };

    var res = trample(obj, { flattenArray: true });

    assert.equal(res['products.0.orderId'], 75);
    assert.equal(res['products.1.orderId'], 32);

    assert.equal(res['foo.bar.0'], 'Hello');
    assert.equal(res['foo.bar.1'], 'World');

    assert.equal(res['address.state.a'], 'ca');
    assert.equal(res['address.state.b'], 'sf');
    assert.equal(res['address.cat.0.name'], 'John Doe');
  });

  it('should delimit by default with a period', function() {
    var obj = { foo: { bar: 'baz' } };
    var res = trample(obj);

    assert.equal(res['foo.bar'], 'baz');
  });

  it('should delimit according to passed in option', function() {
    var obj = { foo: { bar: 'baz' } };
    var res = trample(obj, { delimiter: '_' });

    assert.equal(res['foo_bar'], 'baz');
  });
});
