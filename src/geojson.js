import geojsonvt from "geojson-vt";

export function initGeojson(source, layerID) {
  const extent = 512; // TODO: reset to 4096? Then tolerance can be default 3
  const indexParams = { extent, tolerance: 1 };
  const tileIndex = geojsonvt(source.data, indexParams);

  return function(tileCoords) {
    const { z, x, y } = tileCoords;

    const tile = tileIndex.getTile(z, x, y);

    if (!tile || !tile.features || !tile.features.length) {
      const msg = "geojson-vt returned nothing for tile ";
      const err = Error("tile-retriever: " + msg + [z, x, y].join(","));
      return Promise.reject(err);
    }

    const features = tile.features.map(geojsonvtToJSON);
    const layer = { type: "FeatureCollection", extent, features };
    const json = { [layerID]: layer };

    return Promise.resolve(json);
  };
}

function geojsonvtToJSON(value) {
  const { geometry, type: typeNum, tags: properties } = value;
  if (!geometry) return value;

  const types = ["Unknown", "Point", "LineString", "Polygon"];

  const type = (geometry.length <= 1)
    ? types[typeNum]
    : "Multi" + types[typeNum];

  const coordinates =
    (type == "MultiPolygon") ? [geometry] :
    (type === "Point" || type === "LineString") ? geometry[0] :
    geometry;

  return { geometry: { type, coordinates }, properties };
}
