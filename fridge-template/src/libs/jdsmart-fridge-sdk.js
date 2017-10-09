/**
 * @file jssmart JS SDK for 微联 & 智慧家
 * @author yuelin
 */

;(function() {

  if (window.JDSMART) {
    return
  }

  function isType(type) {
    return function(obj) {
      return {}.toString.call(obj) == '[object ' + type + ']';
    };
  }

  var isFunction = isType('Function');

  var jsbridge;
  var listeners = [];

  var device = {
    id: null,
  };

  /**
   * jdsmart name space
   * @type {Object} JDSMART
   * @namespace
   * @global
   */
  window.JDSMART = {

    inited: false,

    /**
     * 设备属性
     * @type {Object}
     * @property feed_id feed_id {String}
     * @property guid guid {String}
     * @property protocal_type 协议版本 {String}
     * @readonly
     */
    device: {
      id: -1,
    },

    /**
     * 初始化 js 桥
     * @param  {Object} config - 配置
     * @method
     */
    init: function(config) {
      jsbridge = config.bridge;
      jsbridge.init(function(msg, callback) {});

      // var self = this;
      //
      // this.getDeviceProperty(function(data) {
      //
      //      if (typeof Object.assign != 'function') {
      //       Object.assign = function (target, varArgs) { // .length of function is 2
      //         'use strict';
      //         if (target == null) { // TypeError if undefined or null
      //           throw new TypeError('Cannot convert undefined or null to object');
      //         }
      //
      //         var to = Object(target);
      //
      //         for (var index = 1; index < arguments.length; index++) {
      //           var nextSource = arguments[index];
      //
      //           if (nextSource != null) { // Skip over if undefined or null
      //             for (var nextKey in nextSource) {
      //               // Avoid bugs when hasOwnProperty is shadowed
      //               if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
      //                 to[nextKey] = nextSource[nextKey];
      //               }
      //             }
      //           }
      //         }
      //         return to;
      //       };
      //     }
      //
      //   self.device = Object.assign({}, data.result);
      //   self.inited = true;
      // });
      var fn;
      while (fn = listeners.shift()) {
        fn();
      }
    },

    /**
     * 当 Bridge 就绪时，触发一个回调来执行。
     * @param  {Function} callback - 需要执行的回调函数
     */
    ready: function(callback) {
      if (this.inited) {
        callback();
      } else {
        listeners.push(callback);
      }
    },

    //////////////////////// 通用类 start

    /**
     * 显示一个 Toast 提示
     * @param  {String} message - 提示内容
     */
    toast: function(message) {
      // jsbridge.callHandler('messageToast', {
      //   message: message
      // });

      jsbridge.send({
        type: 'messageToast',
        data: {
          message: message
        }
      });
    },

    /**
     * 通过 GET 发送一个 AJAX 请求
     * @param  {String} url - 请求地址
     * @param  {Function} callback - 请求结束时回调函数
     */
    get: function(url, callback) {

      jsbridge.send({ type: 'GET', url: url }, function(data) {
        callback(data);
      });
    },

    /**
     * 通过 Post 发送一个 AJAX 请求
     * @param  {String} url 请求接口地址
     * @param  {Object} params 发送给后端的参数
     * @param  {Function} callback  请求结束时回调函数
     */
    post: function(url, data, callback) {

      jsbridge.send({ type: 'POST', url: url, data: data }, function(data) {
        callback(data);
      });
    },

    /**
     * 获取网络类型的回调方法
     * @callback getNetworkTypeCallback
     * @param {Object} data 标准回调参数。
     * @example
     * JDSMART.getNetworkType(function(data) {
     *   console.log(data.result); // cellular
     * })
     */

    /**
     * 获取网络类型
     * @param {getNetworkTypeCallback} callback 回调
     *
     * @desc callback 参数值如下可选: "bluetooth""cellular""ethernet""none""wifi""other"
     * @link  http://wicg.github.io/netinfo/#connection-types
     */
    getNetworkLable: function(callback) {
      jsbridge.send({ type: 'getNetworkLable' }, function(data) {
        callback(data);
      });
    },

    /**
     * 打开页面
     *   当 url 为 https?:// 开始时，通过 webview 打开 web 页面；
     *   当 url 为特定协议时，(比如微联 APP welink://，智慧家 APP ihome://...
     *    )开始时，打开APP中对应页面.
     * @param  {String} url 目标地址
     */
    open: function(url) {
      jsbridge.send({
        type: 'open',
        data: {
          url: url,
        }
      });
    },

    /**
     * 关闭当前 webview
     */
    close: function() {
      jsbridge.send({ type: 'close' });
    },

    // {
    //  type: 'text|icon'
    //  placeholder: '更多',
    //  callback: fn,
    //  menus: [
    //    {text: '子设备列表页', icon: 'back', callback: fn},
    //    {text: '返回', icon: 'settings', callback: fn},
    //    {text: '分享', icon: 'share', callback: fn},
    //  ]
    // }
    /**
     * 设置右上角配置及操作
     * @param {Object} config 配置
     */
    setNavigationBarRightItem: function(config) {
      jsbridge.send({type: 'setNavigationBarRightItem', data: config});
    },

    /**
     * 设置导航条标题
     * @param {Object.String} config 标题栏配置信息
     */
    setNavigationBarTitle: function(config) {
      if(typeof config === 'string') {
        config = {
          main: config
        }
      }
      jsbridge.send({type: 'setNavigationBarTitle', data: config});
    },

    /**
     * 兼容 jdsmart 1.0 js bridge 实现设置导航条标题
     *
     *  {
     *    showBack: false, // 返回按钮，false 是隐藏，true 是显示
     *    showShare: false,
     *    showMore: false, // 更多按钮
     *    color: “#998877”, // title 栏颜色
     *    showOnline:false // 在线提示 true-不在线，false-在线
     *  }
     */
    setNavigationConfig: function (config) {
      jsbridge.send({type: 'config', data: config});
    },

    /**
     * 分享至第三方社交网站
     * @param {Object} params 分享配置信息
     *                        {cover: '', link: '', title: '', description: ''}
     * @param {Function} callback  分享成功后回调函数
     */
    share: function(params, callback) {
      jsbridge.send({type: 'share', data: params}, function(data) {
        callback(data);
      });
    },

    //////////////////////// 通用类 end


    //////////////////////// 设备控制相关

    /**
     * 当设备（或服务）状态变更时，触发一个回调来执行。
     * @param  {Function} callback 需要执行的回调函数
     */
    onDeviceStateChange: function(callback) {
      jsbridge.registerHandler('onDeviceStateChange', function(data) {
        callback(data);
      });
    },

    /**
     * 获取设备快照
     * @param  {Object} params
     *    3.0：对象，包含 guid 和 service_name
     *    2.0：字符串，feed_id
     * @param  {Function} callback 回调函数
     */
    getSnapshot: function(params, callback) {
      if(typeof params === 'function' && !callback) {
        callback = params;
        params = undefined;
      }
      jsbridge.send({type: 'getSnapshot', data: params}, function(data) {
        callback(data);
      });
    },

    /**
     * 获取设备属性。
     * 对于 joylink 2.0 和 3.0，获取到的设备属性有部分差异。
     * @param  {Function} callback 回调函数
     * @desc callback 中响应的数据区分 joylink 2.0 3.0协议。
     */
    getDeviceProperty: function(params, callback) {
      // data.result：
      //    id (feed_id, guid)
      //    name,
      //    protocal_type,
      //    2.0:
      //      feed_id,
      //      uuid,
      //      product_id,
      //    3.0:
      //      guid,
      //      puid,
      //      cid,
      //      service_name,
      //      service_type,
      if(typeof params === 'function' && !callback) {
        callback = params;
        params = undefined;
      }
      jsbridge.send({type: 'getDeviceProperty', data: params}, function(data) {
        callback(data);
      });
    },

    /**
     * 控制设备
     * @param  {Object} params 控制设备的参数
     * @param  {Function} callback 执行结束时的回调
     */
    controlDevice: function(params, callback) {
      jsbridge.send({ type: 'controlDevice', data: params }, function(data) {
        callback(data);
      });
    },

    /**
     * 调用 service 中提供的方法。
     * @param  {Object} params 函数执行所需要参数
     * @param  {Function} callback 执行结束时的回调
     *
     * @desc  只支持 joylink 3.0
     */
    invokeFunction: function(params, callback) {
      jsbridge.send({ type: 'invokeFunction', data: params }, function(data) {
        callback(data);
      });
    },

    /**
     * 获取设备是否联网的状态
     * @param  {?String} id 可传可不传，不传为获取当前设备是否在线信息
     * @param  {Function} callback 执行结束时的回调
     */
    isOnline: function(id, callback) {
      if(typeof id == 'function' && !callback) {
        callback = id;
        id = undefined;
      }
      jsbridge.send({type: 'isOnline', data: id}, function(data) {
        callback(data);
      });
    }
  }

  document.addEventListener('JDSmartBridgeReady', function onReady(ev) {
    console.log('listened JDSmartBridgeReady event');
    JDSMART.init({ 'bridge': ev.bridge });
  });

  /**
   *  下面是为了兼容 IOS UIWebview 新桥的方法
   */

  function setupWebViewJavascriptBridge(callback) {
    // 首次调用时为 false
    if (window.WebViewJavascriptBridge) {
      var result = callback(WebViewJavascriptBridge);
      return result;
    }

    // 首次调用时为 false
    if (window.WVJBCallbacks) {
      var result = window.WVJBCallbacks.push(callback);
      return result;
    }

    if (typeof callback === 'function') {
      // 将 callback 放入队列，OC 插入代码后执行
      window.WVJBCallbacks = [callback];
    }

    // 执行了这段代码后，OC 才开始向页面插入 JS 代码
    var WVJBIframe = document.createElement('iframe');
    WVJBIframe.style.display = 'none';
    WVJBIframe.src = 'https://__bridge_loaded__';

    document.documentElement.appendChild(WVJBIframe);

    setTimeout(function() {
      document.documentElement.removeChild(WVJBIframe)
    }, 0);
  }

  setupWebViewJavascriptBridge(function(bridge) {
    // IOS UIwebview 的 jsbridge 才会消费这个回调
    console.log('setupWebViewJavascriptBridge be called');
    JDSMART.init({ 'bridge': bridge });
  });
})();
