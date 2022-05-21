import Protobuf from "pbf-esm";
import { VectorTile } from "vector-tile-esm";

export function initMVT(source) {
  const getURL = initUrlFunc(source.tiles);

  return function(tileCoords, init = {}) {
    const { z, x, y } = tileCoords;
    const dataHref = getURL(z, x, y);

    return fetch(dataHref, init)
      .then(getArrayBuffer)
      .then(parseMVT);
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

function getArrayBuffer(response) {
  if (response.status === 200) return response.arrayBuffer();

  const { status, statusText, url } = response;
  throw Error(["HTTP", status, statusText, "from", url].join(" "));
}

function parseMVT(data) {
  const tile = new VectorTile(new Protobuf(data));

  // TODO: use VectorTile.extent. Requires changes in dependencies, dependents
  const size = 512;

  return Object.values(tile.layers)
    .reduce((d, l) => (d[l.name] = l.toGeoJSON(size), d), {});
}
