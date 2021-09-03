import Protobuf from "pbf-esm";
import { VectorTile } from "vector-tile-esm";
import { xhrGet } from "./xhr-get.js";

export function initMVT(source) {
  const getURL = initUrlFunc(source.tiles);

  // TODO: use VectorTile.extent. Requires changes in dependencies, dependents
  const size = 512;

  return function(tileCoords, callback) {
    const { z, x, y } = tileCoords;
    const dataHref = getURL(z, x, y);

    return xhrGet(dataHref, "arraybuffer", parseMVT);

    function parseMVT(err, data) {
      if (err) return callback(err, data);
      const tile = new VectorTile(new Protobuf(data));
      const json = Object.values(tile.layers)
        .reduce((d, l) => (d[l.name] = l.toGeoJSON(size), d), {});
      callback(null, json);
    }
  };
}

function initUrlFunc(endpoints) {
  // Use a different endpoint for each request
  let index = 0;

  return function(z, x, y) {
    index = (index + 1) % endpoints.length;
    const endpoint = endpoints[index];
    return endpoint.replace(/{z}/, z).replace(/{x}/, x).replace(/{y}/, y);
  };
}
