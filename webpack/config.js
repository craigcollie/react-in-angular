import path from 'path';

import plugins from './plugins';
import loaders from './loaders';
import config from './../src/config';

const rootPath = path.resolve(__dirname, './../');
const { isDevEnvironment } = config;

export default {
  entry: [
    'babel-polyfill',
    './index.js',
  ],

  context: `${rootPath}/src`,

  output: {
    path: `${rootPath}/public`,
    filename: isDevEnvironment
      ? 'assets/js/[name].bundle.js'
      : 'assets/js/[name].[chunkhash].bundle.js',
    publicPath: '/',
  },

  module: {
    rules: loaders,
  },

  resolve: {
    alias: {
      '@core': `${rootPath}/src/core`,
      '@components': `${rootPath}/src/components`,
      '@containers': `${rootPath}/src/containers`,
    },
  },

  plugins,
};
