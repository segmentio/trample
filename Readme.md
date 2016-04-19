# Segment Trample

```bash
npm install @segment/trample
```

## Getting Started


```js
var trample = require('@segment/trample');
var obj = trample({ foobar: { bar: ['Hello', 'World'] }}, { flattenArray: true });

// {
//   "foobar.bar.0": "Hello",
//   "foobar.bar.1": "World"
// }
```
