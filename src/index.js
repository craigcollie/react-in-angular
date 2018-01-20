import { h } from 'preact';
import { module, element, bootstrap } from 'angular';

import withAngular from './module/withAngular';

const ReactComponent = ({ items, onClick }) => (
  <div>
    This is a React Component<br/>
    Props: {JSON.stringify(items)}
    <div>
      <button onClick={onClick}>Send event to Angular</button>
    </div>
  </div>
);

const reactComponent = withAngular(ReactComponent, {
  items: '<',
  tests: '<',
  onClick: '&',
});


const component = {
  template: `
    <react-component
      items="$ctrl.items"
      on-click="$ctrl.onClick"
      tests="$ctrl.tests"
    />
  `,
  controller: function (){
    const ctrl = this;

    ctrl.items = ['foo', 'bar'];
    ctrl.tests = [1, 2, 3, 4, 5];

    ctrl.onClick = () => (
      ctrl.items = [...ctrl.items, 'wee']
    );
  },
};

module('angular.app', [])
  .component('rootApp', component)
  .component('reactComponent', reactComponent);

element(() => (
  bootstrap(document.getElementById('root'), ['angular.app'])
));
