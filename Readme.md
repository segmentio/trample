# Segment Trample

```bash
npm install @segment/trample
```

## Getting Started


```js
var trample = require('@segment/trample');

trample({ foobar: { bar: ['Hello', 'World'] }}, { flattenArray: true });
// {
//   "foobar.bar.0": "Hello",
//   "foobar.bar.1": "World"
// }

trample({ foobar: { bar: ['Hello', 'World'] }});
// {
//   "foobar.bar": ["Hello", "World"]
// }


trample({ foobar: [{ bar: ['Hello', 'World'] }]}, { flattenArray: true });
// {
//   "foobar.0.bar.0": "Hello",
//   "foobar.0.bar.1": "World"
// }

trample({ foobar: [{ bar: ['Hello', 'World'] }]});
// {
//   "foobar.0.bar": ["Hello", "World"]
// }
```
