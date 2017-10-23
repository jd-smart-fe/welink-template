<template>
  <div id="app">
    <!-- 头部显示 -->
    <header class="aircleaner" style="width:100%">
      <div class="temperabox">
        <div class="airclean_pm">
          <p>调光面板</p>
          <span>{{current_text}}</span>
        </div>
      </div>
    </header>
    <!-- 开关按钮 -->
    <v-panel>
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title" style="color:#59b8fc">
          <span>{{text_power}}</span>
        </div>
        <v-switch  :hold="true" ref="power" v-model="power_value"></v-switch>
      </div>
    </v-panel>
    <!-- 亮度调节 -->
    <v-panel style="margin-top:0px;">
      <div slot="body" class="c-panel-body row-3 u-cross-center">
        <v-range  style="margin-top:20px;"  slot="main" ref="rangeArray" :min="0" :max="100" :tooltip="range_data_array.tooltip" v-model="range_data_array.value" :is-step="range_data_array.isStep" :disabled="disabled"
        :dots="range_data_array.dots"></v-range>
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
      power_value: false,
      current_text: '关闭',
      mask_show: false,
      text_power: '调光开关',
      disabled: false,
      range_data_array: {
        value: 0,
        tooltip(val) {
          return `${val}%`;
        },
        isStep: false,
        dots: [{
          text: '关',
        },
        {
          text: '亮',
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
           window.console.log(data);
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
      const datas = [{ name: 'brightness', type: 'i', data: value, len: 4 }];
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
            let arrObject = data.result.data.in[0].data; // 可根据信号的商报结构进行 解析可能会有不同方·
            if (typeof (arrObject) === 'string') {
              arrObject = JSON.parse(arrObject);
            }
            for (let i = 0; i < arrObject.length; i += 1) {
              if (arrObject[i].name === 'switch') { // 开关
                if (arrObject[i].data === 'off') {
                  self.power_value = false;
                  self.current_text = '关闭';
                  self.range_data_array.value = 0;
                } else {
                  self.power_value = true;
                  self.current_text = '开启';
                  self.range_data_array.value = 100;
                }
              } else if (arrObject[i].name === 'brightness') { // 开关
                self.range_data_array.value = arrObject[i].data;
                if (arrObject[i].data === 0) {
                  self.current_text = '关闭';
                  self.power_value = false;
                } else if (arrObject[i].data === 100) {
                  self.current_text = '开启';
                  self.power_value = true;
                } else {
                  self.current_text = `${arrObject[i].data}%`;
                  self.power_value = true;
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
              self.power_value = false;
              self.current_text = '关闭';
              self.range_data_array.value = 0;
            } else {
              self.power_value = true;
              self.current_text = '开启';
              self.range_data_array.value = 100;
            }
          } else if (arrObject[i].name === 'brightness') { // 开关
            self.range_data_array.value = arrObject[i].data;
            if (arrObject[i].data === 0) {
              self.current_text = '关闭';
              self.power_value = false;
            } else if (arrObject[i].data === 100) {
              self.current_text = '开启';
              self.power_value = true;
            } else {
              self.current_text = `${arrObject[i].data}%`;
              self.power_value = true;
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
