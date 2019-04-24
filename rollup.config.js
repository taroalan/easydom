const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const { uglify } = require('rollup-plugin-uglify');

const production = !process.env.ROLLUP_WATCH;

export default {
  input: production ? './src/index.js' : './examples/index.js',
  output: {
    name: 'easydom',
    file: 'public/bundle.js',
    format: 'umd',
    sourcemap: production ? false : true,
  },
  plugins: [
    resolve(),
    babel({
      exclude: /node_modules/,
    }),
    commonjs(),
    production && uglify(),
  ],
};
