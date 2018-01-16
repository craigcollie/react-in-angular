const isDevEnvironment = (process.env.NODE_ENV !== 'production');

export default {
  isDevEnvironment,
  excludedModules: /node_modules\/(?!(seek-style-guide)\/)/,
  apiRoot: 'http://localhost:9000',
  assetFolder: '/assets',
  port: 8080,
};
