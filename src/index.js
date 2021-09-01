import { initMVT } from "./mvt.js";
import { initGeojson } from "./geojson.js";

export function init(userParams) {
  const { source, defaultID } = setParams(userParams);

  return (source.type === "geojson")
    ? initGeojson(source, defaultID)
    : initMVT(source);
}

function setParams(userParams) {
  const { source, defaultID = "default" } = userParams;

  if (typeof defaultID !== "string") fail("defaultID must be a string");

  const { type, data, tiles } = source;

  if (type === "geojson") {
    if (!data || !["Feature", "FeatureCollection"].includes(data.type)) {
      fail("no valid geojson features");
    }
  } else if (type === "vector") {
    if (!Array.isArray(tiles) || !tiles.every(url => typeof url === "string")) {
      fail("no valid tile endpoints");
    }
  } else {
    fail("source.type must be geojson or vector");
  }

  return { source, defaultID };
}

function fail(message) {
  throw Error("tile-retriever: " + message);
}
