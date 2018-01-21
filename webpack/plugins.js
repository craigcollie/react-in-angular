import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { isDevEnvironment } from './../env';

export default [
  ...!isDevEnvironment && [
    new ExtractTextPlugin({
      filename: '[name].[hash].css',
      allChunks: true,
    }),
  ],

  ...isDevEnvironment && [
    new HtmlWebpackPlugin({
      template: './demo/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
];
