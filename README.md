# middlebot-resource-cache
[![Build Status](https://travis-ci.org/lemonde/middlebot-resource-cache.svg?branch=master)](https://travis-ci.org/lemonde/middlebot-resource-cache)
[![Dependency Status](https://david-dm.org/lemonde/middlebot-resource-cache.svg?theme=shields.io)](https://david-dm.org/lemonde/middlebot-resource-cache)
[![devDependency Status](https://david-dm.org/lemonde/middlebot-resource-cache/dev-status.svg?theme=shields.io)](https://david-dm.org/lemonde/middlebot-resource-cache#info=devDependencies)

Middlebot resource cache middleware based on redis.

## Install

```sh
npm install middlebot-resource-cache
```

## Usage

```js
var middlebot = require('middlebot');
var app = middlebot();
var cache = require('middlebot-resource-cache')();

app.use(cache.read()); // Read an serve the cache.
app.use(cache.populate()); // Populate the cache.
app.use(cache.invalidate()); // Invalid the cache.
```

### middlebotResourceCache(options)

#### options.cachou

To know avalaible cachou options, please refer to [cachou](https://github.com/neoziro/cachou#cachouoptions--new-cachoucacheoptions).

#### options.name

Name of the resource to cache. The name can be overrided in each method.

### cache.read(options)

Read and serve the cache if avalaible.

```js
app.use(cache.read({ name: 'myResource' }));
```

### cache.populate(options)

Populate the cache with `res.body`.

```js
app.use(cache.populate({ name: 'myResource' }));
```

### cache.invalidate(options)

Invalid the cache of the resource. All cached resource with name and id will be invalidated.

```js
app.use(cache.invalidate({ name: 'myResource' }));
```

## Cache key

The cache key is computed from the `req.query`. The key is formatted as following:

```
{name}:{req.query.id}:{req.query}
```

The module is exposed and can be used in test for example:

```js
var cacheKey = require('middlebot-resource-cache').cacheKey;
var key = cacheKey.format('myResource', 12, query);

console.log(key); // myResource:12:12dea96fec20593566ab75692c9949596833adc9
```

## License

MIT
