// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import Toast from './components/Toast';

// 重新包装了 JSSDK
import sdkWrapper from './libs/sdk.wrapper';

// import style
require('normalize.css');
require('./assets/digital/style.css');

Vue.config.productionTip = true;

// 注册 toast 组件
const Component = Vue.extend(Toast);
const instance = new Component({
  el: document.createElement(Component.options.tag || 'div'),
});
Vue.prototype.$toast = instance;

window.smartSDK = sdkWrapper;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
});
