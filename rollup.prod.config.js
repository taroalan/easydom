const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');

export default {
  input: './src/index.js',
  output: [
    {
      name: 'easydom',
      file: 'dist/easydom.js',
      format: 'es',
      sourcemap: false,
    },
    {
      name: 'easydom',
      file: 'dist/easydom-cjs.js',
      format: 'cjs',
      sourcemap: false,
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: /node_modules/,
    }),
    commonjs(),
  ],
};
