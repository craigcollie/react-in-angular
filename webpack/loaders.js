import autoprefixer from 'autoprefixer';
import ExtractTextPlugin from 'extract-text-webpack-plugin';

import { isDevEnvironment, excludedModules } from './../env';

const cssLoader = {
  loader: 'css-loader',
  options: {
    modules: true,
    importLoaders: 3,
    localIdentName: '[name]__[local]--[hash:base64:5]',
  },
};

const sassLoader = {
  loader: 'sass-loader',
  options: {
    includePaths: [
      'src/styles',
      'node_modules/normalize-scss/sass',
    ],
  },
};

const lessLoader = {
  loader: 'less-loader',
};

const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: [
      autoprefixer({
        browsers: ['last 2 versions'],
      }),
    ],
  },
};

const getLoaderStack = postProcessor => (
  !isDevEnvironment
    ? ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [cssLoader, postCssLoader, postProcessor],
    })
    : ['style-loader', cssLoader, postCssLoader, postProcessor]
);

export default [
  {
    test: /\.js?$/,
    exclude: excludedModules,
    use: ['babel-loader'],
  },
  {
    test: /\.scss?$/,
    exclude: excludedModules,
    loader: getLoaderStack(sassLoader),
  },
  {
    test: /\.less?$/,
    exclude: excludedModules,
    loader: getLoaderStack(lessLoader),
  },
  {
    test: /\.svg?$/,
    exclude: excludedModules,
    use: [
      'raw-loader',
      'svgo-loader',
    ],
  },
];
