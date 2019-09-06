import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import vue from 'rollup-plugin-vue';
import commonjs from 'rollup-plugin-commonjs';
import copyright from './copyrightHeader';

import config from './config';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    name: config.name,
    format: 'umd',
    sourcemap: 'inline',
    globals: {
      $: '$',
    },
    banner: copyright,
  },
  plugins: [
    vue(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true,
    }),
    json(),
  ],
};
