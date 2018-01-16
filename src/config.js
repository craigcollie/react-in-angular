const isDevEnvironment = (process.env.NODE_ENV !== 'production');

export default {
  name: 'MyComponent',
  isDevEnvironment,
  excludedModules: /node_modules\/(?!(seek-style-guide)\/)/,
  apiRoot: 'http://localhost:9000',
  assetFolder: '/assets',
  port: 8080,
};
