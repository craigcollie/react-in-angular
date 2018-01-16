import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import config from './../src/config';

const { isDevEnvironment } = config;

export default [
  new HtmlWebpackPlugin({
    template: './index.html',
  }),

  ...!isDevEnvironment && [
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true,
    }),
  ],

  ...isDevEnvironment && [
    new webpack.HotModuleReplacementPlugin(),
  ],
];
