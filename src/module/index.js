import { h, render, Component } from 'preact';
import { module } from 'angular';

class EventEmitter {
  constructor() {
    this.events = {};
  }
  dispatch(event, newValues) {
    if (event in this.events) {
      this.events[event].apply(null, [newValues]);
    }
  }
  on = (event, fn) => (this.events[event] = fn);
}

const eventEmitter = new EventEmitter();

const transformKeys = (bindings, fn) => Object.keys(bindings).reduce(fn, {});

const mapBindingChangesToProps = (newValues) => (
  transformKeys(newValues, (acc, key) => {
    acc[key] = newValues[key].currentValue;
    return acc;
  })
);

const mapBindingsToInitialProps = (context, bindings) => (
  transformKeys(bindings, (acc, key) => {
    if (bindings[key] === '<') {
      acc[key] = context[key];
    }
    return acc;
  })
);

const mapBindingsToInitialEvents = (context, bindings) => (
  transformKeys(bindings, (acc, key) => {
    if (bindings[key] === '&') {
      acc[key] = context.handleEvent(context[key]);
    }
    return acc;
  })
);

class ReactComponent extends Component {
  constructor(props) {
    super(props);
    this.state = props.initialProps || {};
  }

  componentDidMount = () => (
    eventEmitter.on('change', this.syncWithAngular)
  )

  syncWithAngular = props => this.setState(props);

  render() {
    const { onClick } = this.props;
    const { items } = this.state;
    return (
      <div>
        Props: {JSON.stringify(items)}
        <div>
          <button onClick={onClick}>R button</button>
        </div>
      </div>
    )
  }
}

const component = {
  bindings: {
    items: '<',
    onClick: '&',
  },
  controller: function ($rootScope, $element){
    const ctrl = this;

    ctrl.syncWithCycle = $rootScope => (
      !$rootScope.$$phase && $rootScope.$digest()
    );

    ctrl.handleEvent = fn => (...args) => {
      fn()(...args);
      ctrl.syncWithCycle($rootScope);
    };

    ctrl.$onChanges = (newValues) => (
      eventEmitter.dispatch('change', mapBindingChangesToProps(newValues))
    );

    ctrl.$onInit = () => {
      const { bindings } = component;
      const initialProps = mapBindingsToInitialProps(this, bindings);
      const events = mapBindingsToInitialEvents(this, bindings);

      render(<ReactComponent initialProps={initialProps} {...events} />, $element[0])
    };
  },
};

export default module('react.component', [])
  .component('reactComponent', component);
