const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');

export default {
  input: './src/index.js',
  output: [
    {
      name: 'easydom',
      file: 'dist/easydom.js',
      format: 'es',
      sourcemap: false,
      exports: 'auto',
    },
    {
      name: 'easydom',
      file: 'dist/easydom-cjs.js',
      format: 'cjs',
      sourcemap: false,
      exports: 'auto',
    },
  ],
  plugins: [
    nodeResolve(),
    babel({
      exclude: /node_modules/,
    }),
    commonjs(),
    terser(),
  ],
};
