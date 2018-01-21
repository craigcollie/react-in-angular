import { h, render, Component } from 'preact';
import PropTypes from 'prop-types';

class PropsProxy {
  constructor() {
    this.subscriberFn = null;
  }

  connect(subscriber) {
    this.subscriberFn = subscriber;
  }

  handleNextProps(changes) {
    const nextProps = Object.keys(changes).reduce((acc, key) => {
      const { currentValue } = changes[key];
      acc[key] = currentValue;
      return acc;
    }, {});
    return this.subscriberFn && this.subscriberFn.apply(null, [nextProps]);
  }

  convertBindingsToProps(context, bindings) {
    return Object.keys(bindings).reduce((acc, key) => {
      const bindingType = bindings[key];
      if (!(bindingType in acc)) {
        acc[bindingType] = {};
      }
      const binding = (bindings[key] === '&')
        ? context.handleEvent(context[key])
        : context[key];

      Object.assign(acc[bindingType], { [key]: binding });
      return acc;
    }, {});
  }
}

export default (ReactComponent, { bindings, ...rest }) => {
  const propsProxy = new PropsProxy();

  const setPropTypes = (bindings, propType) => Object.keys(bindings)
    .reduce((acc, key) => {
      acc[key] = propType;
      return acc;
    }, {});

  class ReactComponentWithBindings extends Component {
    static propTypes = {
      oneWayBindings: setPropTypes(bindings, PropTypes.any).isRequired,
      expProps: setPropTypes(bindings, PropTypes.func).isRequired,
    }

    constructor(props) {
      super(props);
      //  Any one-way bindings are set as
      //  default values in the React component
      this.state = { ...props.oneWayBindings };

      //  When any bindings change outside of the
      //  React lifecycle, they are automatically
      //  updated and setState is called
      propsProxy.connect(this.nextBindingChange);
    }

    //  Handles the changes outside of the React
    //  lifecycle and sets the next props as state
    nextBindingChange = (nextProps) => {
      this.setState(nextProps);
    }

    render() {
      const { expProps } = this.props;
      return <ReactComponent {...this.state} {...expProps} />;
    }
  }

  return {
    ...rest,
    bindings,
    controller: function controllerFn($rootScope, $element) {
      //  Wraps all upstream React events with
      //  an additional $digest call to ensure
      this.handleEvent = fn => (...args) => {
        fn()(...args);
        if (!$rootScope.$$phase) {
          $rootScope.$digest();
        }
      };

      //  Maps all one-way binding changes back
      //  to React props through an event service
      this.$onChanges = changes => propsProxy.handleNextProps(changes);

      this.$onInit = () => {
        const props = propsProxy.convertBindingsToProps(this, bindings);
        render(
          <ReactComponentWithBindings
            oneWayBindings={props['<']}
            expProps={props['&']}
          />,
          $element[0],
        );
      };
    },
  };
};
