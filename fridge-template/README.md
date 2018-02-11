# 冰箱控制 H5 模板

[跳转到冰控接入指南](https://github.com/jd-smart-fe/alpha-docs/wiki/%E6%99%BA%E8%83%BD%E5%86%B0%E7%AE%B1%E6%8E%A7%E5%88%B6-H5-%E5%BC%80%E5%8F%91%E6%8E%A5%E5%85%A5%E6%8C%87%E5%8D%97)

[跳转到模板库](https://github.com/jd-smart-fe/welink-template)

## 安装项目

``` bash
# 安装项目依赖
npm install

# 在 localhost:8080 运行项目开发环境（支持热更新）
npm run dev

# 根据生产环境配置打包项目
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

## 开发项目

> 该模板基于 Vue 框架，Vue 有着体积小，速度快，上手易等优点，同时还有这一个非常棒的中文文档 [Vue 中文文档](https://cn.vuejs.org/v2/guide/)，如果你对 Vue 还不是很熟悉，建议可以先快速浏览一下 Vue 的文档。

冰箱控制 H5 模板提供了一个完整的冰箱控制项目示例，你只需要根据具体的业务需求来对项目进行简单的整改即可。

### 公共组件简介

在 `/scr/components` 目录下，提供了一些冰控 H5 常用的一些公共组件。具体 api 可查阅每个组件的 .vue 文件中的 props 属性。例如 Board 组件：

```js
  props: {
    // 面板标题
    title: {
      type: String,
      default: '',
    },
    // 是否需要开关按钮
    hasSwitch: {
      type: Boolean,
      default: false,
    },
    // 显示的温度数字
    num: {
      type: [Number, String],
      default: NaN,
    },
    // 开关置为禁用状态
    disabled: {
      type: Boolean,
      default: false,
    },
    // 开关状态，true为开，false为关
    switchValue: {
      type: Boolean,
      default: null,
    },
    // 数字显示模式。 例如当 num === 5 时：取值 int 时显示 5, float 时显示 5.0
    accur: {
      type: String,
      required: false,
      default: 'int',    // float int
    },
  },
```

### JSSDK

jdsmart-fridge-sdk.js 文件在 `/src/libs` 目录下，同时为了使用方便，我们这里用 `/src/libs/sdk.wrapper.js` 文件重新包装了 JSSDK 中的常用方法。
