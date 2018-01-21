import path from 'path';
import nodeExternals from 'webpack-node-externals';

import plugins from './plugins';
import loaders from './loaders';
import { isDevEnvironment } from './../env';

const rootPath = path.resolve(__dirname, './../');

export default {
  ...isDevEnvironment && {
    entry: './demo/index.js',
    output: {
      path: `${rootPath}/lib`,
      publicPath: '/',
      filename: '[name].bundle.js',
    },
    devtool: 'source-map',
  },

  ...!isDevEnvironment && {
    entry: './src/index.js',
    output: {
      path: `${rootPath}/lib`,
      publicPath: '/',
      filename: 'index.js',
      libraryTarget: 'commonjs2',
    },
    externals: [
      nodeExternals({
        whitelist: ['preact'],
      }),
    ],
  },

  context: rootPath,
  module: { rules: loaders },
  plugins,
};
