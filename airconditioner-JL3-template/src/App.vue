<template>
  <div id="app">
    <!-- 头部显示 -->
    <header class="blue_bg" style="width:100%">
      <div class="temperabox">
        <div class="cur_tempera">
          <span>{{current_text}}</span>
          <p>当前温度°C</p>
        </div>
      </div>
      <ul>
        <li>
          <span>{{mode_text}}</span>
          <p>当前模式</p>
        </li>
        <li>
          <span>{{speed_text}}</span>档
          <p>当前风速</p>
        </li>
      </ul>
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
    <!-- 温度设置 -->
    <v-panel>
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title">温度设置
          <div>{{counter_temp}}°C</div>
        </div>
        <v-counter slot="main" ref="counter" :min="16" :max="32" v-model="counter_temp"></v-counter>
      </div>
    </v-panel>
    <!-- 模式设置 -->
    <v-panel>
      <div slot="header" class="c-panel-header row-2 u-cross-center">
       <div class="c-panel-title">模式设置</div>
      </div>
      <div slot="body" class="c-panel-body row-2 u-without-padding">
        <v-modes v-model="grid_active_id" ref="modes" :numberal="3" :items="grid_data_F3"></v-modes>
      </div>
      <div slot="body" class="c-panel-body row-2 u-without-padding">
        <v-modes v-model="grid_active_id" ref="modess" :numberal="2" :items="grid_data_F2"></v-modes>
      </div>
    </v-panel>
    <!-- 风速调节 -->
    <v-panel>
      <div slot="header" class="c-panel-header row-1 u-cross-center">风速调节</div>
      <div slot="body" class="c-panel-body row-3 u-cross-center">
        <v-range slot="main" ref="rangeArray" v-model="range_data_array.value" :is-step="range_data_array.isStep" :disabled="disabled"
        :dots="range_data_array.dots"></v-range>
      </div>
    </v-panel>
    <!-- 摆风控制 -->
    <!-- 扩展工作模式 -->
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
      current_text: '16',
      speed_text: '自动',
      mode_text: '制冷',
      mask_show: false,
      counter_temp: 22,
      text_power: '空调已关闭',
      grid_active_id: 0,
      grid_data_F3: [{
        text: '自动',
        icon: 'automoatic',
        id: 4,
      },
      {
        text: '除湿',
        icon: 'mode-dry',
        id: 2,
      },
      {
        text: '送风',
        icon: 'mode-cool',
        id: 3,
      }],
      grid_data_F2: [{
        text: '制热',
        icon: 'mode-holiday',
        id: 1,
      },
      {
        text: '制冷',
        icon: 'mode-freeze',
        id: 0,
      }],
      disabled: false,
      range_data_array: {
        value: {
          value: 0,
          text: '自动',
        },
        isStep: true,
        dots: [{
          value: 0,
          text: '自动',
        },
        {
          value: 1,
          text: '低风',
        },
        {
          value: 2,
          text: '中风',
        },
        {
          value: 3,
          text: '高风',
        }],
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
           this.text_power = '空调已开启';
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
           this.text_power = '空调已关闭';
           window.console.log(data);
           this.power_value = value;
           this.$refs.power.relive();
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      }
    });
    // 温度加
    this.$refs.counter.$on('increase', (value) => {
      window.console.log(value);
      if (value <= 32 && this.counter_temp !== 32) {
        const datas = [{ name: 'set_temp', type: 'i', data: value, len: 4 }];
        window.SmartSDK.controlDevice(datas,
         (data) => {
           window.console.log(data);
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      }
    });
    // 温度减
    this.$refs.counter.$on('decrease', (value) => {
      window.console.log(value);
      if (value >= 16 && this.counter_temp !== 16) {
        const datas = [{ name: 'set_temp', type: 'i', data: value, len: 4 }];
        window.SmartSDK.controlDevice(datas,
         (data) => {
           window.console.log(data);
         },
         (err) => {
           window.SmartSDK.toast(err.error.errorInfo);
         });
      }
    });
    // 模式下发
    this.$refs.modes.$on('change', (value) => {
      window.console.log(value);
      if (value === 2) {
        this.disabled = true;
        this.range_data_array.value = { value: 1, text: '低风' };
        this.speed_text = '低风';
      } else {
        this.disabled = false;
      }
      let objs = '';
      if (value === 2) {
        objs = 'dry';
      } else if (value === 3) {
        objs = 'wind';
      } else if (value === 4) {
        objs = 'auto';
      }
      const datas = [{ name: 'mode', type: 's', data: objs, len: objs.length }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
    });
    this.$refs.modess.$on('change', (value) => {
      window.console.log(value);
      this.disabled = false;
      let objs = '';
      if (value === 0) {
        objs = 'cool';
      } else if (value === 1) {
        objs = 'heat';
      }
      const datas = [{ name: 'mode', type: 's', data: objs, len: objs.length }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
    });
    this.$refs.rangeArray.$on('change', (value) => {
      window.console.log(value.value);
      const datas = [{ name: 'fan_speed', type: 'i', data: value.value, len: 4 }];
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
            let arrObject = data.result.data.in[0].data;
            if (typeof (arrObject) === 'string') {
              arrObject = JSON.parse(arrObject);
            }
            for (let i = 0; i < arrObject.length; i += 1) {
              if (arrObject[i].name === 'switch') { // 开关
                if (arrObject[i].data === 'off') {
                  self.power_value = true;
                  self.text_power = '空调已关闭';
                } else {
                  self.power_value = false;
                  self.text_power = '空调已开启';
                }
              } else if (arrObject[i].name === 'mode') { // 模式
                if (arrObject[i].data === 'auto') { // 自动
                  self.grid_active_id = 4;
                  self.mode_text = '自动';
                  self.disabled = false;
                } else if (arrObject[i].data === 'cool') { // 制冷
                  self.grid_active_id = 0;
                  self.mode_text = '制冷';
                  self.disabled = false;
                } else if (arrObject[i].data === 'wind') { // 送风
                  self.grid_active_id = 3;
                  self.mode_text = '送风';
                  self.disabled = false;
                } else if (arrObject[i].data === 'heat') { // 制热
                  self.grid_active_id = 1;
                  self.mode_text = '制热';
                  self.disabled = false;
                } else if (arrObject[i].data === 'dry') { // 除湿
                  self.grid_active_id = 2;
                  self.mode_text = '除湿';
                  self.disabled = true;
                  self.range_data_array.value = { value: 1, text: '低风' };
                  self.speed_text = '低风';
                }
              } else if (arrObject[i].name === 'fan_speed') { // 风速
                let texts = '';
                const valueS = window.parseInt(arrObject[i].data);
                if (valueS === 0) {
                  texts = '自动';
                } else if (valueS === 1) {
                  texts = '低风';
                } else if (valueS === 2) {
                  texts = '中风';
                } else if (valueS === 3) {
                  texts = '高风';
                }
                if (this.grid_active_id !== 2) {
                  self.range_data_array.value = { value: valueS, text: texts };
                  self.speed_text = texts;
                }
              } else if (arrObject[i].name === 'current_temp') { // 当前温度
                self.current_text = arrObject[i].data;
              } else if (arrObject[i].name === 'set_temp') { // 设置温度
                self.counter_temp = arrObject[i].data;
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
              self.text_power = '空调已关闭';
            } else {
              self.power_value = false;
              self.text_power = '空调已开启';
            }
          } else if (arrObject[i].name === 'mode') { // 模式
            if (arrObject[i].data === 'auto') { // 自动
              self.grid_active_id = 4;
              self.mode_text = '自动';
            } else if (arrObject[i].data === 'cool') { // 制冷
              self.grid_active_id = 0;
              self.mode_text = '制冷';
            } else if (arrObject[i].data === 'wind') { // 送风
              self.grid_active_id = 3;
              self.mode_text = '送风';
            } else if (arrObject[i].data === 'heat') { // 制热
              self.grid_active_id = 1;
              self.mode_text = '制热';
            } else if (arrObject[i].data === 'dry') { // 除湿
              self.grid_active_id = 2;
              self.mode_text = '除湿';
            }
          } else if (arrObject[i].name === 'fan_speed') { // 风速
            let texts = '';
            const valueS = window.parseInt(arrObject[i].data);
            if (valueS === 0) {
              texts = '自动';
            } else if (valueS === 1) {
              texts = '低风';
            } else if (valueS === 2) {
              texts = '中风';
            } else if (valueS === 3) {
              texts = '高风';
            }
            self.range_data_array.value = { value: valueS, text: texts };
            self.speed_text = texts;
          } else if (arrObject[i].name === 'current_temp') { // 当前温度
            self.current_text = arrObject[i].data;
          } else if (arrObject[i].name === 'set_temp') { // 设置温度
            self.counter_temp = arrObject[i].data;
          }
        }
      }
    },
    getEorForSnapshot(err) {
      // window.SmartSDK.toast(JSON.stringify(err));
      window.SmartSDK.toast(err.error.errorInfo);
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
