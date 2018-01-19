import { h, render, Component } from 'preact';
import EventEmitter from './EventEmitter';
import * as utils from './bindingUtils';

export default (ReactComponent, bindings) => {
  const ee = new EventEmitter();
  const eventName = 'onChange';

  class ReactComponentWithBindings extends Component {
    constructor(props) {
      super(props);
      this.state = { ...props.initialProps };
    }

    componentDidMount = () => (
      ee.on(eventName, this.syncWithAngular)
    )

    syncWithAngular = props => this.setState(props);

    render() {
      return <ReactComponent {...this.state} {...this.props} />;
    }
  }

  return {
    bindings,
    controller: function ($rootScope, $element){
      const ctrl = this;

      const syncWithCycle = $rootScope => (
        !$rootScope.$$phase && $rootScope.$digest()
      );

      ctrl.handleEvent = fn => (...args) => (
        fn()(...args) && syncWithCycle($rootScope)
      );

      ctrl.$onChanges = (newValues) => (
        ee.dispatch(eventName, utils.mapBindingChangesToProps(newValues))
      );

      ctrl.$onInit = () => {
        render(
          <ReactComponentWithBindings
            initialProps={utils.mapBindingsToInitialProps(this, bindings)}
            {...utils.mapBindingsToInitialEvents(this, bindings)}
          />,
          $element[0]
        );
      };
    },
  };
}
