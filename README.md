# tile-retriever

Load vector tiles from sources described in [MapLibre style documents][]

[MapLibre style documents]: https://maplibre.org/maplibre-gl-js-docs/style-spec/

## Initialization

A new tile retriever function is instantiated as follows:
```javascript
import * as tileRetriever from "tile-retriever";

const retrieve = tileRetriever.init({ source, defaultID });
```

where the initialization parameters are:
- `.source` (REQUIRED): A [MapLibre source object][]. MUST be of type `vector`
  or `geojson`, with all external information (TileJSON description, or GeoJSON
  data) already retrieved and present in the object (NOT linked via URLs).
  You can ensure the data is already retrieved by loading the style with the
  `.loadStyle` method from [tile-stencil][]
- `.defaultID`: Only relevant for GeoJSON sources. Will be used as the layer
  name for the retrieved GeoJSON

[MapLibre source object]: https://maplibre.org/maplibre-gl-js-docs/style-spec/sources/
[tile-stencil]: https://github.com/GlobeletJS/tile-stencil

## Requesting a tile
The retriever function has the following signature:
```javascript
const request = retrieve(tileCoords, callback)
```

where tileCoords has properties `{ z, x, y }`, corresponding to the indices
of the desired tile.

If you call the `retrieve` function, and then decide you don't need the tile,
you can abort the request using the returned request object:
```javascript
request.abort();
```

## Handling the returned tile data
The callback supplied to the `retrieve` function has the following signature
```javascript
function callback(error, json) {
  if (error) throw error;

  console.log(json);
}
```

The returned JSON data is a dictionary of layers, keyed on the original name
from the source [vector tile layer][]. (For geojson sources, there will only be
one layer, with the key being the supplied `defaultID`.) The value of each
layer is a [GeoJSON][] FeatureCollection.

Example:
```json
{
  "layer1": { type: "FeatureCollection", features: [...] },
  "layer2": { type: "FeatureCollection", features: [...] },
  ...
}
```

[vector tile layer]: https://github.com/mapbox/vector-tile-spec/tree/master/2.1#41-layers
[GeoJSON]: https://en.wikipedia.org/wiki/GeoJSON
