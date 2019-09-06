import json from 'rollup-plugin-json';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import copyright from './copyrightHeader';

import config from './config';

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'dist/index.min.js',
      name: config.name,
      format: 'umd',
      globals: {
        $: '$',
      },
      banner: copyright,
    },
  ],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    terser(),
    json(),
  ],
};
