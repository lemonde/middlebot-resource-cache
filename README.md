# middlebot-resource-cache

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

app.use(cache.read); // Read an serve the cache.
app.use(cache.populate); // Populate the cache.
app.use(cache.invalid); // Invalid the cache.
```

### middlebotResourceCache(options)

#### options.cachou

To know avalaible cachou options, please refer to [cachou](https://github.com/neoziro/cachou#cachouoptions--new-cachoucacheoptions).

#### name

Name of the resource to cache.

### cache.read

Read and serve the cache if avalaible.

### cache.populate

Populate the cache with `res.body`.

### cache.invalidate

Invalid the cache of the resource. All cached resource with name and id will be invalidated.

## Cache key

The cache key is computed from the `req.query`. The key is formatted as following:

```
{name}:{req.query.id}:{req.query}
```

## License

MIT