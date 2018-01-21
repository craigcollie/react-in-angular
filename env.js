export const name = 'withAngular';

export const isDevEnvironment = (process.env.NODE_ENV !== 'production');

export const excludedModules = /node_modules\/(?!(seek-style-guide)\/)/;
