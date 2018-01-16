import { module, element, bootstrap } from 'angular';

import reactComponent from './module';

const component = {
  template: `
    <div>
      <react-component items="$ctrl.items" on-click="$ctrl.onClick" />
      <div>
        {{ $ctrl.items }}<br />
        <button ng-click="$ctrl.internalOnClick()">A button</button>
      </div>
    </div>
  `,
  controller: function ($scope){
    const ctrl = this;

    ctrl.items = ['foo', 'bar'];

    const updateItems = () => (
      ctrl.items = [...ctrl.items, 'wee']
    );

    ctrl.internalOnClick = updateItems;
    ctrl.onClick = updateItems;
  }
};

module('angular.app', [reactComponent.name])
  .component('rootApp', component);

element(() => (
  bootstrap(document.getElementById('root'), ['angular.app'])
));
