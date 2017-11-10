/* eslint-disable */
class SmartSDK {
  static WAENMESSAGE = '请检查是否是native环境';
  // 下发控制
  static controlDevice(params, success, faid) {
    try {
      window.JDSMART.controlDevice(params,
        (json) => {
          if (json.status === 0) {
            if (success) {
              success(json);
            }
          } else {
            SmartSDK.toast(json.error.errorInfo);
            if (faid) {
              faid(json.error);
            } else {
              window.console.log(json.error.errorInfo);
            }
          }
        });
    } catch (e) {
      console.warn(this.WAENMESSAGE);
    }
  }
  // toast
  static toast(str) {
    window.console.log(str);
    window.JDSMART.toast(str);
  }
  // 设备快照
  static getSnapshot(callback, faid) {
    try {
      window.JDSMART.getSnapshot(
            (data) => {
              let datas = data;
              if (typeof (datas) === 'string') {
                datas = JSON.parse(datas);
              }
              if (data.status === 0) {
                callback(datas);
              } else {
                faid(datas);
              }
            });
    } catch (e) {
      // faid(e);
      console.warn(this.WAENMESSAGE);
    }
  }
  static getState(callback, faid) {
    try {
      window.JDSMART.onDeviceStateChange(
       (data) => {
         let datas = data;
         if (typeof (datas) === 'string') {
           datas = JSON.parse(datas);
         }
         if (datas.status === 0) {
           callback(datas);
         } else {
           faid(datas);
         }
       },
      );
    } catch (e) {
      console.warn(this.WAENMESSAGE);
    }
  }

  }
export default SmartSDK;
