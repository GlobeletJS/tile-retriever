import resolve from '@rollup/plugin-node-resolve';
import pkg from "../package.json";

export default [{
  input: 'src/index.js',
  plugins: [
    resolve(),
  ],
  external: [
    ...Object.keys(pkg.peerDependencies || {})
  ],
  output: {
    file: pkg.exports.import,
    format: 'esm',
    name: pkg.name,
  }
}, {
  input: 'src/index.js',
  plugins: [
    resolve(),
  ],
  output: {
    file: pkg.module,
    format: 'esm',
    name: pkg.name,
  }
}, {
  input: 'src/index.js',
  plugins: [
    resolve(),
  ],
  output: {
    file: pkg.main,
    format: 'iife',
    name: "tileRetriever" 
  }
}];
