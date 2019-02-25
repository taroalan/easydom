const resolve = require('rollup-plugin-node-resolve');
const babel = require('rollup-plugin-babel');
const { uglify } = require('rollup-plugin-uglify');

const production = !process.env.ROLLUP_WATCH;

export default {
  input: './src/index.js',
  output: {
    name: 'vdom',
    file: 'public/bundle.js',
    format: 'umd',
    sourcemap: production ? false : true
  },
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**'
    }),
    production && uglify()
  ]
}
