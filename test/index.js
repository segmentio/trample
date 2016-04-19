const assert = require('assert');
const trample = require('..');

describe('trample', function() {
  it('should return a function', function() {
    assert.equal('function', typeof trample);
  });

  it('should not trample flattened object', function() {
    const obj = {
      'foobar': 123,
      'cat': 'dog'
    };

    const res = trample(obj);

    assert.equal(res.foobar, 123);
    assert.equal(res.cat, 'dog');
  });

  it('should flatten object', function() {
    const obj = {
      'foobar123': {
        'cat': 123
      }
    };

    const res = trample(obj);
    assert.equal(res['foobar123.cat'], 123);
  });

  it('should flatten complex object', function() {
    const obj = {
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

    const res = trample(obj);

    assert.equal(res['products'][0].orderId, 75);
    assert.equal(res['products'][1].orderId, 32);

    assert.equal(res['foo.bar'][0], 'Hello');
    assert.equal(res['foo.bar'][1], 'World');

    assert.equal(res['address.state.a'], 'ca');
    assert.equal(res['address.state.b'], 'sf');
    assert.equal(res['address.cat'][0].name, 'John Doe');
  });

  it('should flatten complex object w/ tags', function() {
    const obj = {
      products: [
        { orderId: 75, tags: ['one', 'two'] },
        { orderId: 32 }
      ],
    };

    const res = trample(obj);

    assert.equal(res['products'][0].orderId, 75);
    assert.equal(res['products'][0].tags[0], 'one');
    assert.equal(res['products'][0].tags[1], 'two');
    assert.equal(res['products'][1].orderId, 32);
  });

  it('should flatten complex object w/ tags w/ flatten array', function() {
    const obj = {
      products: [
        { orderId: 75, tags: ['one', 'two'] },
        { orderId: 32 }
      ],
    };

    const res = trample(obj, { flattenArray: true });

    assert.equal(res['products.0.orderId'], 75);
    assert.equal(res['products.0.tags.0'], 'one');
    assert.equal(res['products.0.tags.1'], 'two');
    assert.equal(res['products.1.orderId'], 32);
  });

  it('should flatten complex object w/ tags w/ flatten array 123', function() {
    const obj = {
      products: [
        { orderId: { foobar: 123 }, tags: ['one', 'two'] }
      ],
    };

    const res = trample(obj, { flattenArray: true });

    assert.equal(res['products.0.orderId.foobar'], 123);
    assert.equal(res['products.0.tags.0'], 'one');
    assert.equal(res['products.0.tags.1'], 'two');
  });

  it('should flatten complex object including arrays', function() {
    const obj = {
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

    const res = trample(obj, { flattenArray: true });

    assert.equal(res['products.0.orderId'], 75);
    assert.equal(res['products.1.orderId'], 32);

    assert.equal(res['foo.bar.0'], 'Hello');
    assert.equal(res['foo.bar.1'], 'World');

    assert.equal(res['address.state.a'], 'ca');
    assert.equal(res['address.state.b'], 'sf');
    assert.equal(res['address.cat.0.name'], 'John Doe');
  });
});
