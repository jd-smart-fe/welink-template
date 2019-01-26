// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Stone from 'vue-stone';
import App from './App';
import 'vue-stone/dist/vue-stone.css';

// 如果你需要使用组件库中字体图标，请单独引入字体图标的 CSS 文件
import 'vue-stone/dist/iconfonts.css';

// 引入工具类
import * as smartUtils from './utils';

if (process.env.NODE_ENV === 'development') {
  const jdsmart = require('welink-devtool-sdk');
  window.JDSMART = jdsmart;
}

// 工具类挂载到 Vue 原型上方便使用
Vue.prototype.$smartUtils = smartUtils;


Vue.config.productionTip = false;

Vue.use(Stone);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
});
