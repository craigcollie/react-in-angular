import { module, element, bootstrap } from 'angular';

import reactComponent from './module';

const component = {
  template: `
    <react-component items="$ctrl.items" on-click="$ctrl.onClick" />
  `,
  controller: function (){
    const ctrl = this;

    ctrl.items = ['foo', 'bar'];

    ctrl.onClick = () => (
      ctrl.items = [...ctrl.items, 'wee']
    );;
  }
};

module('angular.app', [reactComponent.name])
  .component('rootApp', component);

element(() => (
  bootstrap(document.getElementById('root'), ['angular.app'])
));
