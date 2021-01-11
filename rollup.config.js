const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

const production = !process.env.ROLLUP_WATCH;

export default {
  input: production ? './src/index.js' : './examples/index.js',
  output: {
    name: 'easydom',
    file: 'public/bundle.js',
    format: 'umd',
    sourcemap: true,
  },
  plugins: [
    nodeResolve(),
    babel({
      exclude: /node_modules/,
    }),
    commonjs(),
  ],
};
