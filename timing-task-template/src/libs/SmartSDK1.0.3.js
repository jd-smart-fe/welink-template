/* eslint-disable */
class SmartSDK {
  static WAENMESSAGE = '请检查是否是native环境';
  static BACKURL = ''; // 返回业务页面 比如index.html
  // 头部调用方案
  static titleBar(type, left, right, fun1, fun2, title) {
      let w,display,cab;
      if (type == 'one') {
         w = ['button1', 'button4'];
        display = [left, right];
        cab = [fun1, fun2];
      } else if (type == 'two') {
        w = ['button1'];
        display = [left];
        cab = [fun1];
      } else if (type == 'thr'){
        w = ['button1', 'button4'];
        display = ['', ''];
        cab = ['', ''];
      }
      const param = {
        what: w,
        display: display,
        callBackName: cab
      };
     try {
      window.JDSMART.util.configActionBar(param);
      if (title && title != '' && title != null) {
        window.JDSMART.app.config({titletext: title});
      }
     } catch(e) {
      window.console.warn(this.WAENMESSAGE);
     }
  }
  // toast
  static toast(str) {
    window.JDSMART.app.toast({message: str}, null);
  }
  // 初始化设备数据
  static initDevice(suc) {
    try{
      window.JDSMART.io.initDeviceData((json) => {
        json = typeof json === 'string' ? JSON.parse(json) : json;
        suc(json);
      });
    } catch (e) {
      window.console.warn(this.WAENMESSAGE);
    }
  }
  // 设置在线与离线状态
  static isOnlines(type) {
    try {
       window.JDSMART.app.config({showOnline: type});
    } catch (e) {
      window.console.warn(this.WAENMESSAGE);
    }
  }
  // 判断两个对象是否相同 并返回是否渲染页面
  static diffForObject(oldObj, newObj) {
    if ((!oldObj) || (!newObj) ) {
      this.toast('参数不能为空');
      return [false, {}];
    }
    const flag = this.diffs(oldObj, newObj);
    return [!flag, newObj];
  }
  // 判断对象是否相等函数
  static diffs(object1, object2) {
    for (const propName in object1) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
    }
    for(const propName in object2) {
        if (object1.hasOwnProperty(propName) != object2.hasOwnProperty(propName)) {
            return false;
        }
        else if (typeof object1[propName] != typeof object2[propName]) {
            return false;
        }
        if(!object1.hasOwnProperty(propName))
          continue;
        if (object1[propName] instanceof Array && object2[propName] instanceof Array) {
           if (!object1[propName].equals(object2[propName]))
                        return false;
        }
        else if (object1[propName] instanceof Object && object2[propName] instanceof Object) {
           if (!object1[propName].equals(object2[propName]))
                        return false;
        }
        else if(object1[propName] != object2[propName]) {
           return false;
        }
    }
    return true;
   }
  // 快照函数
  // 控制函数
  static controlDevice(params, success, faid) {
    const paraArr = [];
    for(const key in params) {
      paraArr.push({'stream_id':key, 'current_value': params[key]})
      console.log(params[key]);
    }
    if (paraArr.length === 0) {
      this.toast('控制参数不能为空');
      return ;
    }
    try {
      window.JDSMART.io.controlDevice({'command': paraArr},
        (json) => {
          success(json);
        },
        (err) => {
          faid(err);
          this.toast(err.errorInfo);
        });
    } catch (e) {
      console.warn(this.WAENMESSAGE);
    }
  }
  // 设备快照
  static getSnapshot(callback, faid) {
   try {
      window.JDSMART.io.getSnapshot(
       (data) => {
        data = typeof data === 'string' ? JSON.parse(data) : data;
         callback(data);
        },
        (err) => {
          faid(err);
          this.toast(err.errorInfo);
        });
    } catch (e) {
      console.warn(this.WAENMESSAGE);
    }
  }
  // 定时页面跳转控制
  static pageShow(page) {
    for (let i = 1; i <= 6 ; i += 1) {
      window.document.querySelector("#page"+i).style.display = 'none';
    }
    window.document.querySelector("#page"+page).style.display = 'block';
  }
  // 封装post请求
  static posts(url, params, callback) {
    try {
      window.JDSMART.util.post(url, params, (json) => {
        json = typeof json === 'string' ? JSON.parse(json) : json;
          callback(json);
      });
    } catch (e) {
      console.warn(this.WAENMESSAGE);
    }
  }
  // 获取定时列表片
  static getTasksList(feed, callback) {
    this.posts('service/getTimedTaskByFeedIds', feed, (json) => {
      if (json.status == 0) {
          callback(json.result);
      } else {
          this.toast('获取定时列表失败!');
      }
    });
  }
  // 启用停用定时
  static enOrDisTiming(params, callback) {
      this.posts('service/controlTimedTask', params, (json) => {
        if (json.status == 0) {
          callback(json);
        } else {
          this.toast('操作失败!');
        }
    });
  }
  // 添加定时
  static addTaskTiming(params, callback, faid) {
    this.posts('service/addTimedTask', params, (json) => {
      if (json.status == 0) {
        callback(json);
      } else {
        faid(json);
      }
    });
  }
  //根据taskid 更新定时
  static updataTaskTiming(params, callback, faid) {
    this.posts('service/modifyTimedTask', params, (json) => {
      if (json.status == 0) {
        callback(json);
      } else {
        faid(json);
      }
    });
  }
  // 根据id获取定时任务
  static getTimgByID(params, callback, faid) {
    this.posts('service/getTimedTaskByTaskIds', params, (json) => {
      if (json.status == 0) {
        callback(json);
      } else {
        faid(json);
      }
    });
  }
  // 删除定时任务
  static deleteTaskTiming(params, callback, faid) {
    this.posts('service/removeTimedTask', params, (json) => {
      if (json.status == 0) {
        callback(json);
      } else {
        faid(json);
      }
    });
  }
  //获取日志记录
  static getTaskTimingLog(params, callback, faid) {
    this.posts('service/getTimedTaskResultByFeedId', params, (json) => {
      if (json.status == 0) {
        callback(json);
      } else {
        faid(json);
      }
    });
  }
    //清空记录
    static clearTaskTimingLog(params, callback, faid) {
      this.posts('service/removeTimedTaskResultByFeedId', params, (json) => {
        if (json.status == 0) {
          callback(json);
        } else {
          faid(json);
        }
      });
    }
     //清空记录
     static deleteTaskTimingLog(params, callback, faid) {
      this.posts('service/removeTimedTaskResultByFeedId', params, (json) => {
        if (json.status == 0) {
          callback(json);
        } else {
          faid(json);
        }
      });
    }
  // 获取返回数据所有日期的数组去重
  static getArrayafter(data) {
    const arrdata = [];
    const arrsd = [];
    for (let i = 0; i < data.length; i += 1) {
      if (arrsd.indexOf(data[i].excute_time) == -1) {
        arrsd.push(data[i].excute_time);
        arrdata.push(data[i]);
      }
    }
    return arrdata;
  }
  // 解析类标日期函数
  static getAfterTime (next, type) {
    const listState = {};let text = '';
    listState.show = false;
    listState.color = 'clorin';
    if (parseInt(next) > 0) {
      const nextTime = parseInt(next);
      const nextDay = parseInt(nextTime / 24 / 60);
      if (nextDay < 1) {
        const  hours = parseInt(nextTime / 60) < 10 ? `0${parseInt(nextTime / 60)}` : parseInt(nextTime / 60);
        const  minutes = parseInt(nextTime % 60) < 10 ? `0${parseInt(nextTime % 60)}` : parseInt(nextTime % 60);
        text = parseInt(nextTime / 60) === 0 ? `${minutes}分钟后执行` : `${hours}小时${minutes}分钟后执行`
      }else{
        text = `${nextDay}天后执行`;
      }
    } else if (parseInt(next) === 0) {
      text = `1分钟内执行`;
    } else {
      const obj = this.get_expreee(type);
      if (obj.type === 1) {
        listState.show = true;
        listState.color = 'clorout';
      } else {
        listState.show = false;
      }
    }
    listState.text = text;
    return listState;
  }
  static get_expreee(expreee) {
    const s = expreee.trim().split('_');
    const t = {};
    t.minute = s[0] < 10 ? '0' + parseInt(s[0]) : s[0];
    t.hour = s[1] < 10 ? '0' + parseInt(s[1]) : s[1];
    t.day = s[2];
    t.april = s[3];
    t.week = s[4];
    t.year = s[5];
    t.type = null;
    if (t.day == '*' && t.april == '*' && t.week == '*' && t.year == '*') {
      t.type = 4; // 每天
    } else if (t.april == '*' && t.week == '*' && t.year == '*') {
      t.type = 3; // 每月 几号
    } else if (t.day == '*' && t.april == '*' && t.year == '*') {
      t.type = 2; // 每周几
    } else {
      t.type = 1; // 执行一次
    }
    return t;
  }
  //获取时间和日期函数
  static getDateAndTimes(data) {
    const obj = this.get_expreee(data);
    const expreee = `_${obj.day}_${obj.april}_${obj.week}_${obj.year}`;
    let dateText = '';
    if (obj.type == 1) {
      dateText = `执行一次`;
    } else  if (obj.type == 4) {
      dateText = `每天`;
    } else  if (obj.type == 2) {
      if (obj.week == '6,7') {
        dateText = `周末`;
      } else if( obj.week == '1,2,3,4,5') {
        dateText = `工作日`;
      } else {
        dateText = this.getDateText(obj.week.split(','));
      }
    }
    return [obj.hour, obj.minute, dateText, expreee, obj.type, obj.week];
  }
  // 获取日期说明
  static getDateText (data) {
    const texts = [];
    for (let i = 0; i < data.length; i += 1){
      if (data[i] == 1) {
        texts.push('一');
      }else if(data[i] == 2) {
        texts.push('二');
      }else if(data[i] == 3) {
        texts.push('三');
      }else if(data[i] == 4) {
        texts.push('四');
      }else if(data[i] == 5) {
        texts.push('五');
      }else if(data[i] == 6) {
        texts.push('六');
      }else if(data[i] == 7) {
        texts.unshift('日');
      }
     }
     return  `周${texts.join(' ')}`;
  }
  // 初始化定时类别格式
  static getTasksType() {
    const new_time = new Date();
    return `_${new_time.getDate()}_${(new_time.getMonth()+1)}_*_${new_time.getFullYear()}`;
  }
  // 获取指定格式的时间
  static getFormatedTime() {
    return new Date().Format("yyyy-MM-dd hh:mm");
  }
  // 获取几天后的 时间 和 指定格式
  static GetDateStr(AddDayCount){
    const dates = new Date();
    dates.setDate(dates.getDate() + AddDayCount);//获取AddDayCount天后的日期
    const formatDate = `${dates.getFullYear()}-${dates.getMonth() + 1}-${dates.getDate()}`;
    return [dates, formatDate];
  }
  // 比较时间是否相同
  static timeIsBig(dates) {
    const timeIsNow = new Date();
    const chagetome = dates;
    const time_hs = timeIsNow.getHours();
    const time_min=timeIsNow.getMinutes();
    const oneScoes=parseInt(time_hs) * 60 + parseInt(time_min);
    const twoScoes=parseInt(chagetome[0]) * 60 + parseInt(chagetome[1]);
    let faltime = (oneScoes >= twoScoes);
    return faltime;
  }
  //判断于客户端时间于服务器事件
  static serTimeBig(stime){
    const timeIsNow = new Date();
    const time_hs = timeIsNow.getHours();
    const time_min = timeIsNow.getMinutes();
    const oneScoes = parseInt(time_hs) * 60 + parseInt(time_min);
    const twoScoes = parseInt(stime.substring(11,13)) * 60 + parseInt(stime.substring(14,16));
    const faltime=oneScoes-twoScoes;
    if (faltime >= 3) {
       this.toast("咦！您的手机时间好像不太对哦，我们按照北京时间执行喽！");
    } else if (faltime <= -3) {
       this.toast("咦！您的手机时间好像不太对哦，我们按照北京时间执行喽！");
    }
  }
  // 返回业务页面
  static urlToBack() {
    if (this.BACKURL != '') {
       window.location.href = this.BACKURL;
    } else {
      try{
        window.JDSMART.util.closeWindow();
      } catch (e) {
        console.warn(this.WAENMESSAGE);
      }
    }
  }
  // 修改重复按钮时触发函数
  static getTextAndEps(val) {
    let express, text;
    if (val.length === 7) {
        express = '_*_*_*_*';
        text = '每天';
    } else if (val.length === 5 || val.length === 2) {
      express = `_*_*_${val.join()}_*`;
      if ( val.join() === '1,2,3,4,5') {
        text = '工作日';
      } else if ( val.join() === '6,7'){
        text = '周末';
      } else {
        text = this.getDateText(val);
      }
    } else if (val.length === 0) {
      text = '执行一次';
      express =this.getTasksType();
    } else {
      text = this.getDateText(val);
      express = `_*_*_${val.join()}_*`;
    }
    return [express, text];
  }
  //解析返回数据
  static passDate(data) {
     let number;
     for (let i = 0; i < data.length; i += 1) {
      for (const k in data[i]) {
        if (k === 'power') {
          number = data[i][k];
        }
      }
    }
     return number;
  }

}

export default SmartSDK;
