import { h } from 'preact';
import { module, element, bootstrap } from 'angular';

import withAngular from './withAngular';

const ReactComponent = ({ items, isTrue, onClick }) => (
  <div>
    <h3>This is a React Component</h3>
    <button onClick={onClick}>Add more</button>
    <ul>
      { items.map(item => (<li>{item}</li>)) }
    </ul>
    Is this true? {isTrue}
  </div>
);

const reactComponent = withAngular(ReactComponent, {
  bindings: {
    items: '<',
    tests: '<',
    isTrue: '<',
    onClick: '&',
  },
});

const appComponent = {
  template: `
    <div>
      <h1>My Angular App!</h1>
      <hr />
      
      <react-component
        items="$ctrl.items"
        on-click="$ctrl.onClick"
        tests="$ctrl.tests"
        is-true="$ctrl.isTrue"
      />
    </div>
  `,
  controller: function controllerFn() {
    const ctrl = this;
    let count = 1;

    ctrl.items = ['foo', 'bar'];
    ctrl.tests = [1, 2, 3, 4, 5];
    ctrl.isTrue = false;

    ctrl.onClick = (event) => {
      ctrl.items = [...ctrl.items, `Wee! ${count++}`];
    };
  },
};

module('angular.app', [])
  .component('rootApp', appComponent)
  .component('reactComponent', reactComponent);

element(() => (
  bootstrap(document.getElementById('root'), ['angular.app'])
));
