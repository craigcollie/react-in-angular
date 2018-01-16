import path from 'path';
import nodeExternals from 'webpack-node-externals';

import plugins from './plugins';
import loaders from './loaders';
import config from './../src/config';

const rootPath = path.resolve(__dirname, './../');
const { isDevEnvironment } = config;

export default {
  entry: ['./index.js'],
  context: `${rootPath}/src`,
  output: {
    path: `${rootPath}/lib`,
    filename: 'component.bundle.js',
    publicPath: '/',

    ...!isDevEnvironment && {
      library: 'myComponent',
      libraryTarget: 'window',
    },
  },
  module: {
    rules: loaders,
  },

  ...!isDevEnvironment && {
    externals: [
      nodeExternals({
        whitelist: ['preact'],
      }),
    ],
  },

  plugins,
};
