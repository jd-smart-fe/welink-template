// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';

/* eslint disable next line */
if (process.env.NODE_ENV === 'development') {
  const jdsmart = require('welink-devtool-sdk');
  window.JDSMART = jdsmart;
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
