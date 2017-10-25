<template>
  <div id="app">
    <!-- 头部显示 -->
    <header class="aircleaner" style="width:100%">
      <div class="temperabox">
        <div class="airclean_pm">
          <p>状态</p>
          <span>{{current_text}}</span>
        </div>
      </div>
    </header>
    <!--错误提示条-->
    <div  class="errOth" v-show="err_ece" ><div class="icon_error"></div><div class="text_error">电池电量不足，请更换电池！</div></div>
    <!-- 开关按钮 -->
   <v-panel style="margin-top:0px;width:100%;">
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title" style="color:#59b8fc">
          <span>{{text_power}}</span>
        </div>
        <v-button-switch icon="power" :hold="true" ref="power" v-model="power_value"></v-button-switch>
      </div>
    </v-panel>
    <!-- 亮度调节 -->
    <v-panel>
      <div slot="header" class="c-panel-header row-1 u-cross-center">灵敏度设置</div>
      <div slot="body" class="c-panel-body row-3 u-cross-center">
        <v-range slot="main" ref="rangeArray" :min="1" :max="10" v-model="range_data_array.value" :is-step="range_data_array.isStep" :disabled="disabled"
        :dots="range_data_array.dots"></v-range>
      </div>
    </v-panel>
    <!--灯亮时长-->
    <v-panel>
    <div slot="body" class="c-panel-body row-1 u-cross-center">
      <div style="font-size:15px;">亮灯时长</div>
      <div class="c-timer-content" @click="showTimer" >
       <span style="font-size:12px;color:#888;">{{timers_text}}</span> <span style="font-size:12px;color:#888;" class="icon icon-pull-right"></span>
      </div>
    </div>
    </v-panel>
      <v-picker ref="picker" title="选择时长" mode="modal"
      :shown="mshown" :items="picker_items" @select="confirm" @change="mupdate"
     ></v-picker>
    <div class="mask" v-show="mask_show"></div>
  </div>
</template>

<script>

const monthAry = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
  51, 52, 53, 54, 55, 56, 57, 58, 59];
const yearAry = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const curYear = 0;
const curMonth = 0;

export default {
  name: 'app',
  data() {
    return {
      name: '',
      power_value: true,
      current_text: '正常',
      err_ece: false,
      mask_show: false,
      text_power: '灯已关闭',
      timers: 0,
      timers_text: '',
      disabled: false,
      range_data_array: {
        value: 5,
        isStep: false,
        dots: [{
          text: '低',
        },
        {
          text: '高',
        },
        ],
      },
      picker_items: [{
        values: yearAry.slice(),
        displayValues: yearAry.slice(),
        active: yearAry.indexOf(curYear),
        unit: '分',
      }, {
        values: monthAry.slice(),
        displayValues: monthAry.slice(),
        active: monthAry.indexOf(curMonth),
        unit: '秒',
      }],
      picker_display: 'modal',
      mshown: false,
    };
  },
  mounted() {
    // 开关控制
    this.$refs.power.$on('change', (value) => {
      window.console.log(value);
      if (!value) {
        // 下发开机控制
        const datas = [{ name: 'switch', type: 's', data: 'on', len: 2 }];
        window.SmartSDK.controlDevice(datas,
         (data) => {
           window.console.log(data);
           this.text_power = '灯已关闭';
           this.power_value = value;
           this.$refs.power.relive();
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      } else {
        // 下发关机控制
        const datas = [{ name: 'switch', type: 's', data: 'off', len: 3 }];
        window.SmartSDK.controlDevice(datas,
         (data) => {
           window.console.log(data);
           this.text_power = '灯已开启';
           this.power_value = value;
           this.$refs.power.relive();
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      }
    });
    this.$refs.rangeArray.$on('change', (value) => {
      window.console.log(value);
      const datas = [{ name: 'sensitivity', type: 'i', data: value, len: 4 }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
    });
    window.JDSMART.ready(() => {
      // window.console.log(2);
      // 判断是否在线
      this.onLineIs();
      // 获取快照信息
      window.SmartSDK.getSnapshot((suc) => {
        this.getsucForSnapshot(suc);
      }, (err) => {
        this.getEorForSnapshot(err);
      });
      // 注册信号函数
      this.jsCallback();
    });
  },
  methods: {
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
          if (data.result.data !== '') {
            if (data.result.data.member.name === 'properties_changed' && data.result.data.member.type === 'signal') {
              let arrObject = data.result.data.in[0].data;
              if (typeof (arrObject) === 'string') {
                arrObject = JSON.parse(arrObject);
              }
              for (let i = 0; i < arrObject.length; i += 1) {
                if (arrObject[i].name === 'switch') { // 开关
                  if (arrObject[i].data === 'off') {
                    self.power_value = true;
                    self.current_text = '关闭';
                    self.text_power = '灯已关闭';
                  } else {
                    self.power_value = false;
                    self.current_text = '亮灯';
                    self.text_power = '灯已开启';
                  }
                } else if (arrObject[i].name === 'sensitivity') {
                  self.range_data_array.value = arrObject[i].data;
                } else if (arrObject[i].name === 'duration') {
                  if (window.parseInt(arrObject[i].data / 60) === 0) {
                    self.timers_text = `${window.parseInt(arrObject[i].data % 60)}秒`;
                  } else {
                    self.timers_text = `${window.parseInt(arrObject[i].data / 60)}分${window.parseInt(arrObject[i].data % 60)}秒`;
                  }
                } else if (arrObject[i].name === 'battery_voltage') {
                  if (arrObject[i].data === 'normal') {
                    self.err_ece = false;
                  } else {
                    self.err_ece = true;
                  }
                }
              }
            }
            if (data.result.data.member.name === 'alarm' && data.result.data.member.type === 'signal') {
              let arrObject = data.result.data.in;
              if (typeof (arrObject) === 'string') {
                arrObject = JSON.parse(arrObject);
              }
              for (let i = 0; i < arrObject.length; i += 1) {
                if (arrObject[i].name === 'info' && arrObject[i].data === 'low_voltage') {
                  self.err_ece = true;
                }
              }
            }
          }
        },
        (err) => {
          window.SmartSDK.toast(err.error.errorInfo);
        });
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
          if (arrObject[i].name === 'switch') { // 开关
            if (arrObject[i].data === 'off') {
              self.power_value = true;
              self.current_text = '关闭';
              self.text_power = '灯已关闭';
            } else {
              self.power_value = false;
              self.current_text = '亮灯';
              self.text_power = '灯已开启';
            }
          } else if (arrObject[i].name === 'sensitivity') {
            self.range_data_array.value = arrObject[i].data;
          } else if (arrObject[i].name === 'duration') {
            if (window.parseInt(arrObject[i].data / 60) === 0) {
              self.timers_text = `${window.parseInt(arrObject[i].data % 60)}秒`;
            } else {
              self.timers_text = `${window.parseInt(arrObject[i].data / 60)}分${window.parseInt(arrObject[i].data % 60)}秒`;
            }
          } else if (arrObject[i].name === 'battery_voltage') {
            if (arrObject[i].data === 'normal') {
              self.err_ece = false;
            } else {
              self.err_ece = true;
            }
          }
        }
      }
    },
    getEorForSnapshot(err) {
      window.SmartSDK.toast(err.error.errorInfo);
    },
    confirm(val) { // 确定
      if (val.select === 'cancel') {
        this.mshown = false;
      } else if (val.select === 'determine') {
        const datas = [{ name: 'duration', type: 'i', data: this.timers, len: 4 }];
        window.SmartSDK.controlDevice(datas,
         (data) => {
           window.console.log(data);
           if (val.value[0] === 0) {
             this.timers_text = `${val.value[1]}秒`;
           } else {
             this.timers_text = `${val.value[0]}分${val.value[1]}秒`;
           }
           this.mshown = false;
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      }
      window.console.log(`当前所选值: ${JSON.stringify(val)}`);
    },
    mupdate(val) { // 重置
      window.console.log(`当前值已改变，新值为 ${JSON.stringify(val)}`);
      this.timers = (val.value[0] * 60) + val.value[1];
    },
    showTimer() {
      this.mshown = true;
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
</style>
