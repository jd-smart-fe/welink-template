# template

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 开发项目

> 该模板基于 Vue 框架，Vue 有着体积小，速度快，上手易等优点，同时还有这一个非常棒的中文文档 [Vue 中文文档](https://cn.vuejs.org/v2/guide/)，如果你对 Vue 还不是很熟悉，建议可以先快速浏览一下 Vue 的文档。

基于joyLink2.0 协议的  定时模版 H5 模板提供了一个完整的 定时模版 项目示例，你只需要根据具体的业务需求来对项目进行简单的整改即可。

### 公共组件简介

本项目使用了vue-stone组件库，具体的使用方案可以查看Github:[vue-stone](https://github.com/jd-smart-fe/vue-stone/)。

### JSSDK

src/libs目录下的SmartSDK1.0.3.js文件是对 index.html中[JSSDK](https://static.360buyimg.com/smart/jdsmart-1.0.3.js)引用文件的封装，开发者可以根据需求进行修改。JSSDK文档说明可以在开发者中心 [文档中心](https://smartdev.jd.com/)下载。

### 设备参数
 | 参数名        | 说明           | 范围  |    是否控制    |
| ------------- |:-------------:| :-----:| ------------:|
| power       | 开关       | 0~1    |   可控      |
### 使用指南
```
task.html
static/js/task.js
static/css/task.css
```
1, build 后的文件目录，可独立引用；<br/>
2，资源文件 SmartSDK1.0.3.js 中 BACKURL 设置 返回的业务页面；（业务页面必需初始化configActionBar， 否则 头部title不会正常显示）<br/>
3，如果定时值是组命令， 请设置 taskName = false；在```<section id="page4"></section>```中添加相应功能，修改
  timed_task.task_express的值 及定时任务的名称显示；getTaskTimingbyId() 也需要做相应改动具体看代码。
  ```
  待补全
  ```




