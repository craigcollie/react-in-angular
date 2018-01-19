const transformKeys = (bindings, fn) => (
  Object.keys(bindings)
    .reduce(fn, {})
);

export const mapBindingChangesToProps = (newValues) => (
  transformKeys(newValues, (acc, key) => {
    acc[key] = newValues[key].currentValue;
    return acc;
  })
);

export const mapBindingsToInitialProps = (context, bindings) => (
  transformKeys(bindings, (acc, key) => {
    if (bindings[key] === '<') {
      acc[key] = context[key];
    }
    return acc;
  })
);

export const mapBindingsToInitialEvents = (context, bindings) => (
  transformKeys(bindings, (acc, key) => {
    if (bindings[key] === '&') {
      acc[key] = context.handleEvent(context[key]);
    }
    return acc;
  })
);
