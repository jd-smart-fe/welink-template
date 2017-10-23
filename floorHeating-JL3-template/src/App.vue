<template>
  <div id="app">
    <!--头部-->
    <header class="orange_bg" style="width:100%">
        <ul>
        <li>
          <p>温度设定</p>
          <span>{{set_temp}}°C</span>
        </li>
        <li>
          <p>当前温度</p>
          <span>{{current_temp}}°C</span>
        </li>
      </ul></header>
      <!--地暖开关-->
     <v-panel style="margin-top:0px;width:100%;">
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title" style="color:#fe9f7a">
          <span>{{text_power}}</span>
        </div>
        <v-button-switch class="c-btn-s" icon="power" :hold="true" ref="power" v-model="power_value"></v-button-switch>
      </div>
    </v-panel>
      <!--设置温度-->
        <v-panel>
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title">温度设置
          <div style="color:#fe9f7a;">{{set_temp}}°C</div>
        </div>
        <v-counter slot="main"  ref="counter" :min="16" :max="32" v-model="set_temp"></v-counter>
      </div>
    </v-panel>
      <!--设备不在线蒙层-->
    <div class="mask" v-show="mask_show"></div>
  </div>
</template>

<script>

export default {
  name: 'app',
  data() {
    return {
      name: '',
      mask_show: false,
      percentage: 50,
      text_power: '地暖已关闭',
      power_value: true,
      current_temp: 22,
      set_temp: 22,
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
           this.text_power = '地暖运行中';
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
           this.text_power = '地暖已关闭';
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
      if (value <= 32 && this.set_temp !== 32) {
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
      if (value >= 16 && this.set_temp !== 16) {
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
    // 桥入口
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
          if (data.result.data.member.name === 'properties_changed' && data.result.data.member.type === 'signal') {
            let arrObject = data.result.data.in[0].data;
            if (typeof (arrObject) === 'string') {
              arrObject = JSON.parse(arrObject);
            }
            window.SmartSDK.toast(arrObject.length);
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
        if (arrObject[i].name === 'switch') { // 地暖开关状态
          if (arrObject[i].data === 'off') {
            self.power_value = true;
            self.text_power = '地暖已关闭';
          } else {
            self.power_value = false;
            self.text_power = '地暖运行中';
          }
        } else if (arrObject[i].name === 'set_temp') { // 温度设置
          self.set_temp = arrObject[i].data;
        } else if (arrObject[i].name === 'current_temp') { // 当前温度
          self.current_temp = arrObject[i].data;
        }
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
      window.SmartSDK.toast(arrObject);
      if (data.result.errorMsg === 'com.joylink.ok') {
        for (let i = 0; i < arrObject.length; i += 1) {
          if (arrObject[i].name === 'switch') { // 地暖开关状态
            if (arrObject[i].data === 'off') {
              self.power_value = true;
              self.text_power = '地暖已关闭';
            } else {
              self.power_value = false;
              self.text_power = '地暖运行中';
            }
          } else if (arrObject[i].name === 'set_temp') { // 温度设置
            self.set_temp = arrObject[i].data;
          } else if (arrObject[i].name === 'current_temp') { // 当前温度
            self.current_temp = arrObject[i].data;
          }
        }
      }
    },
    getEorForSnapshot(err) { // 快照返回失败
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
