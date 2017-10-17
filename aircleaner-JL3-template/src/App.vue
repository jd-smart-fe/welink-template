<template>
  <div id="app">
    <!-- 头部显示 -->
    <header class="aircleaner" style="width:100%">
      <div class="temperabox">
        <div class="airclean_pm">
          <p>PM2.5指数</p>
          <span>{{current_text}}</span>
        </div>
      </div>
      <div class="airquality">空气质量：{{airQuality}}</div>
    </header>
    <!-- 开关按钮 -->
    <v-panel style="margin-top:0px;width:100%;">
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title" style="color:#59b8fc">
          <span>{{text_power}}</span>
        </div>
        <v-button-switch icon="power" :hold="true" ref="power" v-model="power_value"></v-button-switch>
      </div>
    </v-panel>
    <!-- 风速调节 -->
    <v-panel>
      <div slot="header" class="c-panel-header row-1 u-cross-center">风速设置</div>
      <div slot="body" class="c-panel-body row-3 u-cross-center">
        <v-range slot="main" ref="rangeArray" :min="1" :max="10" v-model="range_data_array.value" :is-step="range_data_array.isStep" :disabled="disabled"
        :dots="range_data_array.dots"></v-range>
      </div>
    </v-panel>
    <v-panel v-show="luxin">
      <div slot="body" class="c-panel-body row-1 u-cross-center">
       <div>滤芯已使用 </div>
       <div><i class="i_right">{{daysforlx}}</i> 天</div>
      </div>
    </v-panel>
     <v-panel v-show="!luxin">
      <div slot="body" class="c-panel-body row-1 u-cross-center">
       <div style="color:#f9734e;">滤芯已耗尽，请更换 </div>
       <div class="i_right" @click="resets"> 重置</div>
      </div>
    </v-panel>
    <div class="mask" v-show="mask_show"></div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      name: '',
      power_value: true,
      current_text: 22,
      airQuality: '良',
      mask_show: false,
      text_power: '设备已开启',
      disabled: false,
      luxin: true,
      daysforlx: 0,
      range_data_array: {
        value: 5,
        isStep: false,
        dots: [{
          icon: 'range-small',
        },
        {
          icon: 'range-large',
        },
        ],
      },
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
           this.text_power = '设备已开启';
           window.console.log(data);
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
           this.text_power = '设备已关闭';
           window.console.log(data);
           this.power_value = value;
           this.$refs.power.relive();
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      }
    });
    // 滑杆滑动
    this.$refs.rangeArray.$on('change', (value) => {
      window.console.log(value);
      const datas = [{ name: 'wind', type: 'i', data: value, len: 4 }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
    });
    window.JDSMART.ready(() => {
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
            let arrObject = data.result.data.in[0].data; // 可根据信号的商报结构进行 解析可能会有不同方·
            if (typeof (arrObject) === 'string') {
              arrObject = JSON.parse(arrObject);
            }
            for (let i = 0; i < arrObject.length; i += 1) {
              if (arrObject[i].name === 'switch') { // 开关
                if (arrObject[i].data === 'off') {
                  self.power_value = true;
                  self.text_power = '设备已关闭';
                } else {
                  self.power_value = false;
                  self.text_power = '设备已开启';
                }
              } else if (arrObject[i].name === 'wind') { // 风速
                window.console.log(arrObject[i].data);
                self.range_data_array.value = arrObject[i].data;
              } else if (arrObject[i].name === 'timestamp') { // 滤芯使用时间
                window.console.log(arrObject[i].data);
                if (arrObject[i].data >= 4320) {
                  self.luxin = false;
                } else {
                  self.luxin = true;
                  self.daysforlx = window.parseInt(arrObject[i].data / 24);
                }
              } else if (arrObject[i].name === 'pm2dot5') { // pm2.5
                window.console.log(arrObject[i].data);
                self.current_text = arrObject[i].data;
              } else if (arrObject[i].name === 'air_quality') { // 空气质量
                window.console.log(arrObject[i].data);
                if (arrObject[i].data === 1) {
                  self.airQuality = '优';
                } else if (arrObject[i].data === 2) {
                  self.airQuality = '良';
                } else if (arrObject[i].data === 3) {
                  self.airQuality = '轻度污染';
                } else if (arrObject[i].data === 4) {
                  self.airQuality = '中度污染';
                } else if (arrObject[i].data === 5) {
                  self.airQuality = '重度污染';
                } else if (arrObject[i].data === 6) {
                  self.airQuality = '严重污染';
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
              self.text_power = '设备已关闭';
            } else {
              self.power_value = false;
              self.text_power = '设备已开启';
            }
          } else if (arrObject[i].name === 'wind') { // 风速
            window.console.log(arrObject[i].data);
            self.range_data_array.value = arrObject[i].data;
          } else if (arrObject[i].name === 'timestamp') { // 滤芯使用时间
            window.console.log(arrObject[i].data);
            if (arrObject[i].data >= 4320) {
              self.luxin = false;
            } else {
              self.luxin = true;
              self.daysforlx = window.parseInt(arrObject[i].data / 24);
            }
          } else if (arrObject[i].name === 'pm2dot5') { // pm2.5
            window.console.log(arrObject[i].data);
            self.current_text = arrObject[i].data;
          } else if (arrObject[i].name === 'air_quality') { // 空气质量
            window.console.log(arrObject[i].data);
            if (arrObject[i].data === 1) {
              self.airQuality = '优';
            } else if (arrObject[i].data === 2) {
              self.airQuality = '良';
            } else if (arrObject[i].data === 3) {
              self.airQuality = '轻度污染';
            } else if (arrObject[i].data === 4) {
              self.airQuality = '中度污染';
            } else if (arrObject[i].data === 5) {
              self.airQuality = '重度污染';
            } else if (arrObject[i].data === 6) {
              self.airQuality = '严重污染';
            }
          }
        }
      }
    },
    getEorForSnapshot(err) {
      window.SmartSDK.toast(err.error.errorInfo);
    },
    resets() {
      const datas = [{ name: 'timestamp', type: 'i', data: 0, len: 4 }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
    },
  },
};

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
