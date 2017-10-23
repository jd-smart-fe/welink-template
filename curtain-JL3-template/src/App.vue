<template>
  <div id="app">
    <!--头部-->
    <header><img src="./images/headerbg.png"><span>{{percentage}}<em>%</em></span></header>
      <!--窗帘开关-->
      <v-panel>
      <div slot="header" class="c-panel-header row-2 u-cross-center">
       <div class="c-panel-title">窗帘遥控器</div>
      </div>
      <div slot="body" class="c-panel-body row-2 u-without-padding">
        <v-modes v-model="grid_active_id" ref="modes" :numberal="3" :items="grid_data_F3"></v-modes>
      </div>
    </v-panel>
      <!--窗帘开合百分比-->
    <v-panel>
      <div slot="header" class="c-panel-header row-1 u-cross-center">窗帘开合调节： {{range_data_array.value}}%</div>
      <div slot="body" class="c-panel-body row-3 u-cross-center">
        <v-range slot="main" ref="rangeArray" v-model="range_data_array.value" :is-step="range_data_array.isStep"
        :min="0" :max="100" :dots="range_data_array.dots"></v-range>
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
      range_data_array: {
        value: 50,
        isStep: false,
        dots: [{
          text: '0',
        },
        {
          text: '100',
        }],
      },
      grid_active_id: 5,
      grid_data_F3: [{
        text: '关闭窗帘',
        icon: '',
        id: 1,
      },
      {
        text: '暂停',
        icon: '',
        id: 2,
      },
      {
        text: '打开窗帘',
        icon: '',
        id: 3,
      }],
    };
  },
  mounted() {
    // 下发开关控制
    this.$refs.modes.$on('change', (value) => {
      window.console.log(value);
      let objs = '';
      if (value === 1) {
        // this.grid_data_F3[0].text = '正在关闭';
        objs = 'off';
      } else if (value === 2) {
        window.console.log(value);
        // self.grid_data_F3[2].text = '打开窗帘';
        // this.grid_data_F3[0].text = '关闭窗帘';
        objs = 'stop';
      } else if (value === 3) {
        // this.grid_data_F3[2].text = '正在打开';
        objs = 'on';
      }
      const datas = [{ name: 'switch', type: 's', data: objs, len: objs.length }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
    });
    // 下发百分比控制
    this.$refs.rangeArray.$on('change', (value) => {
      window.console.log(value);
      const datas = [{ name: 'percentage', type: 'i', data: value, len: 4 }];
      window.SmartSDK.controlDevice(datas,
       (data) => {
         window.console.log(data);
       },
       (err) => {
         window.SmartSDK.toast(err.error.errorInfo);
       });
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
          if (data.result.data.member.name === 'status' && data.result.data.member.type === 'signal') {
            let arrObject = data.result.data.in;
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
        if (arrObject[i].name === 'switch') { // 窗帘开关状态
          if (arrObject[i].data === 'on') {
            self.grid_data_F3[2].text = '正在打开';
            self.grid_active_id = 3;
            self.grid_data_F3[0].text = '关闭窗帘';
          } else if (arrObject[i].data === 'off') {
            self.grid_data_F3[0].text = '正在关闭';
            self.grid_active_id = 1;
            self.grid_data_F3[2].text = '打开窗帘';
          } else if (arrObject[i].data === 'stop') {
            self.grid_active_id = 4;
            self.grid_data_F3[2].text = '打开窗帘';
            self.grid_data_F3[0].text = '关闭窗帘';
          }
        } else if (arrObject[i].name === 'percentage') { // 开合百分比
          self.percentage = arrObject[i].data;
          self.range_data_array.value = arrObject[i].data;
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
          if (arrObject[i].name === 'switch') { // 窗帘开关状态
            if (arrObject[i].data === 'on') {
              self.grid_data_F3[2].text = '正在打开';
              self.grid_active_id = 3;
            } else if (arrObject[i].data === 'off') {
              self.grid_data_F3[0].text = '正在关闭';
              self.grid_active_id = 1;
            } else if (arrObject[i].data === 'stop') {
              self.grid_active_id = 4;
              self.grid_data_F3[2].text = '打开窗帘';
              self.grid_data_F3[0].text = '关闭窗帘';
            }
          } else if (arrObject[i].name === 'percentage') { // 开合百分比
            self.percentage = arrObject[i].data;
            self.range_data_array.value = arrObject[i].data;
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
