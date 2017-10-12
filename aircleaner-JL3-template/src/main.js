// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Stone from 'vue-stone';
import 'vue-stone/dist/vue-stone.css';
import SmartSDK from './libs/SmartSDK2-0-0';
import App from './App';


Vue.config.productionTip = false;

Stone.install(Vue);
require('./css/aircleaner.css');

window.SmartSDK = SmartSDK;
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
