<template>
  <div id="app">
    <!--头部-->
      <!-- 头部显示 -->
    <header :class="headerType" style="width:100%">
      <div class="temperabox">
        <div class="airclean_pm">
          <p>门锁状态</p>
          <span>{{now_state}}</span>
        </div>
      </div>
    </header>
    <!--错误提示条-->
    <div v-show="alarm_ece"  class="errOth" ><div class="icon_error"></div><div class="text_error">设备电量低，请更换电池</div></div>
    <!--title-->
     <v-panel  style="border: none; ">
      <div slot="body" class="c-panel-body row-1 u-cross-center" >
        <div slot="title" class="c-panel-title " style="color:#333"><span >按钮报警记录</span></div>
        <div>
          <button  class="icon_today" v-show="today_show" @click="initDateGetlog"></button>
          <div v-show="today_show" class="i_cla"></div>
          <button  class="icon_data" @click="changeDate"></button></div>
      </div>
    </v-panel>
        <!--无记录-->
    <v-panel style="margin-top:0px;"  v-show="!dataHave">
      <div slot="body" class="dateTitle"><span>{{defaultDate}}</span><i></i><span>{{defaultStr}}</span></div>
      <div slot="body" class="noData" >
       <div class="icon_nodata" ></div>
       <div style="font-size:10px;">当天没有记录</div>
     </div>
   </v-panel>
      <!--有数据填充-->
   <div class="dass" v-show="dataHave">
   <v-panel v-for="(list,index) in logList"  style="margin-top:0px;" :key="index">
    <div slot="body" class="dateTitle"><span>{{list.date}}</span><i></i><span >{{list.week}}</span></div>
    <div slot="body" class="datalist">
      <ul >
      <li v-for="(oneList,xnum) in list.lists"  :key="xnum"><i v-if="(list.lists.length > 1)"></i><em></em><span>{{oneList.time}}</span><span >{{oneList.text}}</span></li>
      </ul>
    </div>
  </v-panel>
  </div>
  <v-picker ref="picker" title="选择日期" mode="modal"
      :shown="mshown" :items="picker_items" @select="confirm" @change="mupdate"
     ></v-picker>
      <!--设备不在线蒙层-->
    <div class="mask" v-show="mask_show"></div>
    <v-dialog ref="dialog" v-model="showdialog" title="报警" :desc="desc"></v-dialog>
  </div>
</template>

<script>
// 初始化时间控件
const monthAry = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const yearAry = [2015, 2016, 2017];
const dayAry = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
  18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
const now = new Date();
const curYear = now.getFullYear();
const curMonth = now.getMonth() + 1;
const curDay = now.getDate();

export default {
  name: 'app',
  data() {
    return {
      name: '',
      mask_show: false,
      today_show: false,
      desc: '报警',
      error_str: '',
      error_alarm: true,
      power_value: true,
      alarm_ece: false,
      showdialog: false,
      error_text: '',
      defaultDate: '',
      defaultStr: '',
      headerType: 'aircleaner',
      dataHave: false,
      timesStart: '',
      startDate: '',
      now_state: '已锁定',
      picker_items: [{
        values: yearAry.slice(),
        displayValues: yearAry.slice(),
        active: yearAry.indexOf(curYear),
        unit: '年',
      }, {
        values: monthAry.slice(),
        displayValues: monthAry.slice(),
        active: monthAry.indexOf(curMonth),
        unit: '月',
      }, {
        values: dayAry.slice(),
        displayValues: dayAry.slice(),
        active: dayAry.indexOf(curDay),
        unit: '日',
      }],
      picker_display: 'modal',
      mshown: false,
      logList: [],
    };
  },
  mounted() {
    // 桥入口
    const dates = new Date();
    this.defaultDate = this.getOneDateTime(dates).riqis;
    this.defaultStr = this.getMyWeek(dates);
    window.JDSMART.ready(() => {
      // window.console.log(2);
      // 判断是否在线
      this.onLineIs();
      // 初始化信号日志
      this.initDateGetlog();
      // 获取快照信息
      window.SmartSDK.getSnapshot((suc) => {
        this.getsucForSnapshot(suc);
      }, (err) => {
        this.getEorForSnapshot(err);
      });
      // 注册信号函数
      this.jsCallback();
    });
    this.$refs.dialog.$on('buttonfirst', () => {
      this.showdialog = false;
      this.error_alarm = false;
    });
  },
  methods: {
    doDialogShow(val) {
      if (this.error_alarm) {
        this.showdialog = true;
        this.error_str = val;
      } else if (!this.error_alarm) {
        if (this.error_str !== val) {
          this.showdialog = true;
          this.error_str = val;
        }
      }
    },
    jsCallback() {
      const self = this;
      window.SmartSDK.getState(
        (data) => {
          if (window.parseInt(data.result.status) === 0) {
            this.mask_show = true;
            window.SmartSDK.toast('设备离线不可用');
          } else {
            this.mask_show = false;
          }
          if (data.result.data.member.name === 'status' && data.result.data.member.type === 'signal') {
            let arrObject = data.result.data.in;
            if (typeof (arrObject) === 'string') {
              arrObject = JSON.parse(arrObject);
            }
            self.singenals(arrObject);
          }
          if (data.result.data.member.name === 'alarm' && data.result.data.member.type === 'signal') {
            let arrObject = data.result.data.in;
            if (typeof (arrObject) === 'string') {
              arrObject = JSON.parse(arrObject);
            }
            self.singenals(arrObject);
          }
        },
        (err) => {
          window.SmartSDK.toast(err.error.errorInfo);
        });
    },
    singenals(arrObject) {
      const self = this;
      for (let i = 0; i < arrObject.length; i += 1) {
        if (arrObject[i].name === 'lock') { // 门锁状态
          if (arrObject[i].data === 'on') {
            self.now_state = '已开启';
          } else {
            self.now_state = '已锁定';
          }
        }
        if (arrObject[i].name === 'info') { // 锁报警
          if (arrObject[i].data === 'passwd_err') {
            self.desc = '有人开门，连续输入密码错误';
            self.doDialogShow(arrObject[i].data);
            // 多次密码输入错误
          } else if (arrObject[i].data === 'fp_err') {
            // 多次指纹解锁
            self.doDialogShow(arrObject[i].data);
            self.desc = '有人开门，连续输入指纹错误';
          } else if (arrObject[i].data === 'low_voltage') {
            self.alarm_ece = true;
          } else if (arrObject[i].data === 'destroying') {
            // 门锁损坏
            self.doDialogShow(arrObject[i].data);
            self.desc = '门锁损坏';
          } else if (arrObject[i].data === 'not_lock_tightly') {
            // 门锁未关严
            self.doDialogShow(arrObject[i].data);
            self.desc = '门锁未完全锁闭';
          }
        }
      }
      if (!self.today_show) {
        self.chageSiganlData();
      }
    },
    onLineIs() { // 判断设备是否在线
      window.JDSMART.isOnline((suc) => {
        if (suc.result.status === 0) {
          this.mask_show = true;
          window.SmartSDK.toast('设备离线不可用');
        } else {
          this.mask_show = false;
        }
      });
    },
    getsucForSnapshot(data) { // 快照返回成功
      const self = this;
      let arrObject = data.result.out[0].data;
      if (typeof (arrObject) === 'string') {
        arrObject = JSON.parse(arrObject);
      }
      if (data.result.errorMsg === 'com.joylink.ok') {
        for (let i = 0; i < arrObject.length; i += 1) {
          if (arrObject[i].name === 'battery_voltage') { // 信号报警或是电压低
            if (arrObject[i].data === 'low') {
              self.alarm_ece = true;
              self.error_text = '电池电量不足，请更换电池！';
            } else {
              self.alarm_ece = false;
            }
          }
          if (arrObject[i].name === 'lock') { // 信号报警或是电压低
            if (arrObject[i].data === 'on') {
              self.now_state = '已开启';
            } else {
              self.alarm_ece = '已锁定';
            }
          }
        }
      }
    },
    getEorForSnapshot(err) { // 快照返回失败
      window.SmartSDK.toast(err.error.errorInfo);
    },
    changeDate() {
      // newMOt
      this.initDateDates();
      this.mshown = true;
      window.document.querySelector('.c-mask').onclick = () => {
        this.mshown = false;
      };
      window.document.querySelector('.c-picker-head-cancel').innerHTML = '重置';
    },
    initDateDates() { // 初始化日期
      const dates = new Date();
      const years = [(dates.getFullYear() - 2), (dates.getFullYear() - 1), dates.getFullYear()];
      const mouth = [];
      for (let i = 0; i < 12; i += 1) {
        mouth.push((i + 1));
      }
      window.console.log(years);
      this.picker_items = [{
        values: years.slice(),
        displayValues: years.slice(),
        active: years.indexOf(dates.getFullYear()),
        unit: '年',
      }, {
        values: mouth.slice(),
        displayValues: mouth.slice(),
        active: mouth.indexOf(dates.getMonth() + 1),
        unit: '月',
      }, {
        values: dayAry.slice(),
        displayValues: dayAry.slice(),
        active: dayAry.indexOf(curDay),
        unit: '日',
      }];
    },
    mupdate(val) { // 滑动事件
      const dates = new Date();
      window.console.log(val);
      const month = [];
      const days = [];
      for (let i = 0; i < 12; i += 1) {
        month.push((i + 1));
      }
      let datd = 30;
      const mots = val.value[1];
      const chayear = val.value[0];
      if (mots === 1 || mots === 3 || mots === 5 ||
        mots === 7 || mots === 8 || mots === 10 || mots === 12) {
        datd = 31;
      } else if (mots === 4 || mots === 6 || mots === 9 || mots === 11) {
        datd = 30;
      } else if (mots === 2) {
        if (((chayear % 4) === 0 && (chayear % 100) !== 0) || (chayear % 400) === 0) {
          datd = 28;
        } else {
          datd = 29;
        }
      }
      for (let i = 0; i < 31; i += 1) {
        days.push((i + 1));
      }
      const years = dates.getFullYear();
      if (val.value[0] === years) {
        if (dates.getMonth() < 11 && val.value[1] > (dates.getMonth() + 1)) {
          window.console.log(1123212);
          this.$set(this.picker_items, 1, {
            values: month.slice(),
            displayValues: month.slice(),
            active: dates.getMonth(),
            unit: '月',
          });
        }
        if (val.value[1] === (dates.getMonth() + 1) &&
         dates.getDate() < 31 && val.value[2] > dates.getDate()) {
          this.$set(this.picker_items, 2, {
            values: days.slice(),
            displayValues: days.slice(),
            active: (dates.getDate() - 1),
            unit: '日',
          });
        } else if (val.value[1] < (dates.getMonth() + 1) &&
         val.value[2] > datd) {
          this.$set(this.picker_items, 2, {
            values: days.slice(),
            displayValues: days.slice(),
            active: (datd - 1),
            unit: '日',
          });
        }
      } else if (val.value[0] !== years && val.value[2] > datd) {
        this.$set(this.picker_items, 2, {
          values: days.slice(),
          displayValues: days.slice(),
          active: (datd - 1),
          unit: '日',
        });
      }
    },
    confirm(val) { // 确定
      if (val.select === 'cancel') {
        this.initDateDates();
      } else if (val.select === 'determine') {
        const self = this;
        const years = val.value[0];
        const mots = val.value[1];
        const datd = val.value[2];

        const dssdt = `${years}-${(mots < 10 ? `0${mots}` : mots)}-${(datd < 10 ? `0${datd}` : datd)}`;
        const starts = `${years}-${(mots < 10 ? `0${mots}` : mots)}-01T00:00:00+0800`;
        const ends = `${dssdt}T23:59:59+0800`;
        self.lastAllTime = starts;
        self.defaultDate = dssdt;
        self.defaultStr = self.getMyWeek(new Date(dssdt));
        window.JDSMART.post('/device/signal/history', self.getProperty(starts, ends, ''), (suc) => {
          let arrObject = suc;
          if (typeof (arrObject) === 'string') {
            arrObject = JSON.parse(arrObject);
          }
          const stas = window.parseInt(arrObject.status);
          const codes = window.parseInt(arrObject.result.code);
          if (stas === 0 && codes === 200) {
            self.getSuccFirst(arrObject, 'chang');
          } else {
            window.SmartSDK.toast('网络异常，获取失败！');
          }
          self.mshown = false;
        });
      }
    },
    initDateGetlog() { // 获取本月所有记录
      const dates = new Date();
      this.defaultDate = this.getOneDateTime(dates).riqis;
      this.defaultStr = this.getMyWeek(dates);
      this.startDate = this.getOneDateTime(dates).riqis;
      this.timesStart = this.getOneDateTime(dates).times;
      const starts = `${this.getOneDateTime(dates).riqis}T00:00:00+0800`;
      const ends = `${this.getOneDateTime(dates).riqis}T23:59:59+0800`;
      this.lastAllTime = `${this.getOneDateTime(dates).riqis}T00:00:00+0800`;
      window.JDSMART.post('/device/signal/history',
      this.getProperty(starts, ends, ''), (suc) => {
        let arrObject = suc;
        if (typeof (arrObject) === 'string') {
          arrObject = JSON.parse(arrObject);
        }
        const stas = window.parseInt(arrObject.status);
        const codes = window.parseInt(arrObject.result.code);
        if (stas === 0 && codes === 200) {
          this.getSuccFirst(arrObject, 'init');
        } else {
          window.SmartSDK.toast('网络异常，获取失败！');
        }
      });
    },
    chageSiganlData() { // 信号改变后新增记录
      const self = this;
      const dates = new Date();
      const starts = `${self.startDate}T${self.timesStart}+0800`;
      const ends = `${self.getOneDateTime(dates).riqis}T23:59:59+0800`;
      self.startDate = self.getOneDateTime(dates).riqis;
      self.timesStart = self.getOneDateTime(dates).times;
      window.JDSMART.post('/device/signal/history', self.getProperty(starts, ends, 10), (suc) => {
        let arrObject = suc;
        if (typeof (arrObject) === 'string') {
          arrObject = JSON.parse(arrObject);
        }
        const stas = window.parseInt(arrObject.status);
        const codes = window.parseInt(arrObject.result.code);
        if (stas === 0 && codes === 200) {
          this.getSuccFirst(arrObject, 'rech');
        } else {
          window.SmartSDK.toast('网络异常，获取失败！');
        }
      });
    },
    newMOt() {
      const arrmot = [];
      for (let i = 0; i < curMonth; i += 1) {
        arrmot.push(1);
      }
      return arrmot;
    },
    getSuccFirst(data, type) {
      const self = this;
      if (data.result.data.length !== 0) {
        if (type === 'init') {
          self.today_show = false;
          self.logList = [];
          self.getSuccInit(data.result.data);
        } else if (type === 'rech') {
          self.getSuccRech(data.result.data);
        } else if (type === 'chang') {
          self.logList = [];
          self.getSuccChang(data.result.data);
          self.today_show = true;
        }
      } else if (data.result.data.length === 0) {
        // 无数据判断
        if (type === 'init') {
          const dates = new Date();
          self.defaultDate = self.getOneDateTime(dates).riqis;
          self.defaultStr = self.getMyWeek(dates);
          self.dataHave = false;
          self.today_show = false;
          self.logList = [];
        } else if (type === 'chang') {
          self.dataHave = false;
          self.today_show = true;
          self.logList = [];
        }
      }
    },
    getSuccInit(data) {
      const self = this;
      self.timesStart = data[0].time.substr(0, 19).substr(11, 19);
      self.startDate = data[0].time.substr(0, 10);
      self.dataHave = true;
      self.lastAllTime = data[data.length - 1].time;
      const arrDates = self.getLists(data);
      for (let i = 0; i < arrDates.length; i += 1) {
        const objslog = {};
        objslog.date = arrDates[i];
        objslog.week = self.getMyWeek(new Date(arrDates[i]));
        objslog.lists = [];
        for (let j = 0; j < data.length; j += 1) {
          const lis = {};
          if (data[j].time.substr(0, 10) === arrDates[i]) {
            lis.text = self.getMyText(data[j]);
            if (lis.text !== '') {
              lis.time = data[j].time.substr(0, 19).substr(11, 19);
              objslog.lists.push(lis);
            }
          }
        }
        self.logList.push(objslog);
      }
    },
    getSuccRech(data) {
      const self = this;
      self.dataHave = true;
      if (self.logList.length < 1) {
        self.lastDates = self.getOneDateTime(new Date()).riqis;
        self.logList.push({ date: self.getOneDateTime(new Date()).riqis,
          week: self.getMyWeek(new Date()),
          lists: [] });
      } else {
        self.lastDates = self.logList[0].date;
      }
      const arrDates = self.getLists(data);
      for (let i = arrDates.length - 1; i < arrDates.length; i -= 1) {
        if (self.lastDates === arrDates[i]) {
          for (let j = data.length - 1; j < data.length; j -= 1) {
            const lis = {};
            if (data[j].time.substr(0, 10) === arrDates[i]) {
              lis.time = data[j].time.substr(0, 19).substr(11, 19);
              lis.text = self.getMyText(data[j]);
              if (lis.text !== '') {
                let isTrue = false;
                for (let d = 0; d < self.logList[0].lists.length; d += 1) {
                  if (self.logList[0].lists[d].time === lis.time) {
                    isTrue = true;
                  }
                }
                if (!isTrue) {
                  self.logList[0].lists.unshift(lis);
                }
              }
            }
          }
         // 当天更新
        } else {
        // alert("第二天");
          const objslog = {};
          objslog.date = arrDates[i];
          objslog.week = self.getMyWeek(new Date(arrDates[i]));
          objslog.lists = [];
          for (let j = 0; j < data.length; j += 1) {
            const lis = {};
            if (data[j].time.substr(0, 10) === arrDates[i]) {
              lis.time = data[j].time.substr(0, 19).substr(11, 19);
              lis.text = self.getMyText(data[j]);
              if (lis.text !== '') {
                objslog.lists.push(lis);
              }
            }
          }
          self.logList.unshift(objslog);
        }
      }
    },
    getSuccChang(data) {
      const self = this;
      self.dataHave = true;
      self.lastAllTime = data[data.length - 1].time;
      const arrDates = self.getLists(data);
      for (let i = 0; i < arrDates.length; i += 1) {
        const objslog = {};
        objslog.date = arrDates[i];
        objslog.week = self.getMyWeek(new Date(arrDates[i]));
        objslog.lists = [];
        for (let j = 0; j < data.length; j += 1) {
          const lis = {};
          if (data[j].time.substr(0, 10) === arrDates[i]) {
            lis.text = self.getMyText(data[j]);
            if (lis.text !== '') {
              lis.time = data[j].time.substr(0, 19).substr(11, 19);
              objslog.lists.push(lis);
            }
          }
        }
        self.logList.push(objslog);
      }
    },
    getProperty(starsTimes, endTimes, counts) {
      const deviceData = window.JDSMART.device.services;
      let vsion = '';
      for (let i = 0; i < deviceData.length; i += 1) {
        if (deviceData[i].name === window.JDSMART.device.cur_service_name) {
          vsion = deviceData[i].version;
        }
      }
      const objs = {};
      objs.guid = window.JDSMART.device.guid;
      objs.serviceName = window.JDSMART.device.cur_service_name;
      objs.serviceVersion = vsion;
      objs.signalNames = ['status', 'alarm'];
      objs.endTime = endTimes;
      if (counts !== '') {
        objs.count = counts;
      }
      if (starsTimes !== '') {
        objs.startTime = starsTimes;
      }
      return objs;
    },
    getOneDateTime(myDate) { // 获取显示年月日时分秒
      const year = myDate.getFullYear(); // 年
      const mos = (myDate.getMonth() + 1) < 10 ? `0${(myDate.getMonth() + 1)}` : (myDate.getMonth() + 1); // 月
      const das = myDate.getDate() < 10 ? `0${myDate.getDate()}` : myDate.getDate(); // 日
      const hour = myDate.getHours() < 10 ? `0${myDate.getHours()}` : myDate.getHours(); // 小时
      const minute = myDate.getMinutes() < 10 ? `0${myDate.getMinutes()}` : myDate.getMinutes(); // 分
      const second = myDate.getSeconds() < 10 ? `0${myDate.getSeconds()}` : myDate.getSeconds(); // 秒
      const riqi = `${year}-${mos}-${das}`;
      const time = `${hour}:${minute}:${second}`;
      return {
        years: year,
        months: mos,
        days: das,
        hours: hour,
        minutes: minute,
        seconds: second,
        riqis: riqi,
        times: time };
    },
    getLists(data) { // 获取返回数据所有日期的数组去重
      const arrdata = [];
      for (let i = 0; i < data.length; i += 1) {
        if (arrdata.indexOf(data[i].time.substr(0, 10)) === -1) {
          arrdata.push(data[i].time.substr(0, 10));
        }
      }
      return arrdata;
    },
    getMyWeek(myDate) { // 获取星期
      const nowDate = new Date();
      const newdd = this.getOneDateTime(myDate).riqis;
      const noda = this.getOneDateTime(nowDate).riqis;
      const sdfs = myDate.getDay();
      let das = '';
      if (sdfs === 0) {
        das = '周日';
      } else if (sdfs === 1) {
        das = '周一';
      } else if (sdfs === 2) {
        das = '周二';
      } else if (sdfs === 3) {
        das = '周三';
      } else if (sdfs === 4) {
        das = '周四';
      } else if (sdfs === 5) {
        das = '周五';
      } else if (sdfs === 6) {
        das = '周六';
      }
      if (newdd === noda) {
        das = `今天，${das}`;
      }
      return das;
    },
    getMyText(data) {
      let strText = '';
      let opens = '';
      let ways = '';
      let nums = '';
      if (data.status !== undefined) {
        const datas = data.status;
        for (let i = 0; i < datas.length; i += 1) {
          nums = datas[i].id;
          if (datas[i].unlock_way === 'password') {
            ways = '密码';
          } else if (datas[i].unlock_way === 'fingerprint') {
            ways = '指纹';
          } else if (datas[i].unlock_way === 'app') {
            ways = '远程';
          } else if (datas[i].unlock_way === 'card') {
            ways = '感应卡';
          }
          if (datas[i].lock === 'on') {
            opens = '开锁';
            strText = `${ways}${nums}${opens}`;
          } else {
            strText = '门锁上锁 ';
          }
        }
      }
      if (data.alarm !== undefined) {
        const alarms = data.alarm;
        for (let i = 0; i < alarms.length; i += 1) {
          if (alarms[i].info === 'low_voltage') {
            strText += '电池电量低';
          } else if (alarms[i].info === 'passwd_err') {
            strText += '有人开锁，连续输错密码';
          } else if (alarms[i].info === 'fp_err') {
            strText += '有人开锁，连续输错指纹';
          } else if (alarms[i].info === 'destroying') {
            strText += '门锁损坏';
          } else if (alarms[i].info === 'not_lock_tightly') {
            strText += '门锁未完全锁闭';
          }
        }
      }
      return strText;
    },
  },
};

</script>

<style>
body{
  overflow: hidden;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
  .icon_error{
    display: inline-block;
    width:30px;
    height: 30px;
    margin:10px;
    background:url("images/icon_error.png") no-repeat center;
    background-size: 100%;
  }
    .icon_today{
      border-style:none;
      outline: none;
      width: 0.3rem;
      height: 0.3rem;
      background:url("images/icon_today.png") no-repeat center;
      background-size: 80%;
    }
   .icon_data{
      border-style:none;
      outline: none;
      width: 0.3rem;
      height: 0.3rem;
      background:url("images/icon_data.png") no-repeat center;
      background-size: 100%;
    }
     .noData .icon_nodata{
     width:1rem ;
     height: 1rem;
     margin:auto;
     background:url("images/icon_nodata.png") no-repeat center;
     background-size: 100%;
   }

</style>
