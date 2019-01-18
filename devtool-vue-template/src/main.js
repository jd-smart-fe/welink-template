// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Stone from 'vue-stone';
import App from './App';
import 'vue-stone/dist/vue-stone.css';

// 如果你需要使用组件库中字体图标，请单独引入字体图标的 CSS 文件
import 'vue-stone/dist/iconfonts.css';
import SmartSDK from './libs/SmartSDKUtils';

if (process.env.NODE_ENV === 'development') {
  const jdsmart = require('welink-devtool-sdk');
  window.JDSMART = jdsmart;
}


window.SmartSDK = SmartSDK;

Vue.config.productionTip = false;

Vue.use(Stone);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
