import './jdsmart-fridge-sdk';

const sdkWrapper = {
  getSnapshot(id, success, fail) {
    try {
      window.JDSMART.getSnapshot(id, data => {

        const __data = typeof data === 'string'
          ? JSON.parse(data)
          : data;

        console.log(__data);

        if (__data.status == 0) {
          success(__data);
        } else {
          console.warn('设备离线');
          console.warn(__data);
        }
      });
    } catch (e) {
      // fail();
      console.warn('快照失败，请检查是否是native环境');
    }
  },

  controlDevice(arr, success, fail) {
    try {
      window.JDSMART.controlDevice(arr, (data) => {
        const __data = typeof data === 'string'
          ? JSON.parse(data)
          : data;

        // 成功且有回调函数
        if (__data.status == 0 && success) {
          success(__data);

        // 成功且没有回调函数
        } else if (__data.status == 0) {

        // 失败且有回调函数
        } else if (__data.status != 0 && fail) {
          if (__data.error.errorInfo === '设备不在线') { // 拦截云端提示语
            // 替换云端提示“设备不在线”之前保留云端提示
            __data.error.sourceErrorInfo = __data.error.errorInfo;
            // 替换成相应的文案提示语
            __data.error.errorInfo = '冰箱已断开连接';
            // fail(__data.error);
          }
          fail(__data.error);

        // 失败且没有回调函数
        } else {
          if (__data.error.errorInfo === '设备不在线') { // 拦截云端提示语
            // 替换云端提示“设备不在线”之前保留云端提示
            __data.error.sourceErrorInfo = __data.error.errorInfo;
            __data.error.errorInfo = '冰箱已断开连接';
            // fail(__data.error);
          }
        }
      });
    } catch (e) {
      // fail();
      console.warn('下发失败，请检查是否是native环境');
    }
  },

  getCommand(obj) {
    let command = [];

    for (const item in obj) {
      if (obj.hasOwnProperty(item)) {
        let stream = {};
        stream.stream_id = item;
        stream.current_value = obj[item];
        command.push(stream);
      } else {
        return null;
      }

    }
    return command;
  },

  setNavigationConfig(config) {
    window.JDSMART.setNavigationConfig(config);
  },
};

export default sdkWrapper;
