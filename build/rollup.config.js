import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'; // Needed for pbf module
import pkg from "../package.json";

export default [{
  input: 'src/index.js',
  plugins: [
    resolve(),
    commonjs(),
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
    commonjs(),
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
    commonjs(),
  ],
  output: {
    file: pkg.main,
    format: 'iife',
    name: "tileRetriever" 
  }
}];
