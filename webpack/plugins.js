import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import config from './../src/config';

const { isDevEnvironment } = config;

const isVendor = m => (
  m.context && m.context.indexOf('node_modules') !== -1
);

export default [
  new HtmlWebpackPlugin({
    template: './index.html',
  }),

  ...!isDevEnvironment && [
    new ExtractTextPlugin({
      filename: 'assets/css/[name].[hash].css',
      allChunks: true,
    }),
  ],

  ...isDevEnvironment && [
    new webpack.HotModuleReplacementPlugin(),
  ],

  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: isVendor,
  }),
];
