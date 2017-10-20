<template>
  <div id="app">
    <!-- 头部显示 -->
    <header class="blue_bg" style="width:100%">
      <ul>
        <li>
          <p>风速</p>
          <span>{{wind_sty}}</span>
        </li>
        <li>
          <p>PM2.5</p>
          <span>{{pm2dot5}}</span>
        </li>
      </ul>
        <div class="airquality">送风温度：{{current_temp}}°C</div>
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
    <!-- 模式设置 -->
    <v-panel>
      <div slot="header" class="c-panel-header row-2 u-cross-center">
       <div class="c-panel-title">模式设置</div>
      </div>
      <div slot="body" class="c-panel-body row-2 u-without-padding">
        <v-modes v-model="grid_active_id" ref="modes" :numberal="3" :items="grid_data_F3"></v-modes>
      </div>
    </v-panel>
    <!-- 风速调节 -->
    <v-panel>
      <div slot="header" class="c-panel-header row-1 u-cross-center">
         <div class="c-panel-title">风速调节</div></div>
      <div slot="body" class="c-panel-body row-3 u-cross-center">
        <v-range slot="main" ref="rangeArray" v-model="range_data_array.value" :is-step="range_data_array.isStep" :disabled="disabled"
        :dots="range_data_array.dots"></v-range>
      </div>
    </v-panel>
    <!-- 滤芯 -->
    <v-panel>
      <div slot="body" class="u-cross-center"  style="height:0.4rem;margin-top:0.1rem;">
       <div class="left_lvxin" v-show="lvxin1" >滤芯已使用 </div>
       <div class="left_lvxin" v-show="!lvxin1" style="color:#f9734e;">滤芯已耗尽，请更换 </div>
       <div class="right_lvxin" v-show="!lvxin1"  @click="resets(1)"> 重置</div>
       <div class="right_lvxin" v-show="lvxin1" ><i class="i_right">{{timestamp1}}</i> 天</div>
      </div>
      <!-- <div slot="body" class="u-cross-center" style="height:0.4rem" >
       <div class="left_lvxin">滤芯已使用 </div>
       <div class="right_lvxin"><i class="i_right">22</i> 天</div>
      </div>  -->
      <div slot="body" class="u-cross-center" style="height:0.4rem;margin-bottom:0.1rem;">
       <div class="left_lvxin" v-show="lvxin2">全热交换芯已使用 </div>
        <div class="left_lvxin" v-show="!lvxin2" style="color:#f9734e;">滤芯已耗尽，请更换 </div>
       <div class="right_lvxin" v-show="!lvxin2" @click="resets(2)"> 重置</div>
       <div class="right_lvxin" v-show="lvxin2"><i class="i_right">{{timestamp2}}</i> 天</div>
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
      lvxin1: true,
      lvxin2: true,
      power_value: true,
      mask_show: false,
      text_power: '设备已关闭',
      current_temp: '---',
      pm2dot5: '0',
      wind_sty: '低',
      timestamp1: 0,
      timestamp2: 0,
      grid_active_id: 1,
      grid_data_F3: [{
        text: '新风',
        icon: '',
        id: 1,
      },
      {
        text: '综合',
        icon: '',
        id: 2,
      },
      {
        text: '净化',
        icon: '',
        id: 3,
      }],
      disabled: false,
      range_data_array: {
        value: {
          value: 1,
          text: '低',
        },
        isStep: true,
        dots: [{
          value: 1,
          text: '低',
        },
        {
          value: 2,
          text: '中',
        },
        {
          value: 3,
          text: '高',
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
    // 模式下发
    this.$refs.modes.$on('change', (value) => {
      window.console.log(value);
      let objs = '';
      if (value === 1) {
        objs = 'new_air';
      } else if (value === 2) {
        objs = 'mix';
      } else if (value === 3) {
        objs = 'internal_circulate';
      }
      const datas = [{ name: 'purifymode', type: 's', data: objs, len: objs.length }];
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
      let objs = '';
      if (value.value === 1) {
        objs = 'low';
      } else if (value.value === 2) {
        objs = 'medium';
      } else if (value.value === 3) {
        objs = 'high';
      }
      const datas = [{ name: 'wind', type: 's', data: objs, len: objs.length }];
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
                  self.text_power = '设备已关闭';
                } else {
                  self.power_value = false;
                  self.text_power = '设备已开启';
                }
              } else if (arrObject[i].name === 'purifymode') { // 模式
                if (arrObject[i].data === 'new_air') { // 新风
                  self.grid_active_id = 1;
                  self.mode_text = '新风';
                } else if (arrObject[i].data === 'mix') { // 混合风
                  self.grid_active_id = 2;
                  self.mode_text = '综合';
                } else if (arrObject[i].data === 'internal_circulate') { // 内循环
                  self.grid_active_id = 3;
                  self.mode_text = '净化';
                }
              } else if (arrObject[i].name === 'wind') { // 风速
                let texts = '';
                const valueS = arrObject[i].data;
                let nums = 1;
                if (valueS === 'low') {
                  texts = '低';
                  nums = 1;
                } else if (valueS === 'medium') {
                  texts = '中';
                  nums = 2;
                } else if (valueS === 'high') {
                  texts = '高';
                  nums = 3;
                }
                self.wind_sty = texts;
                self.range_data_array.value = { value: nums, text: texts };
              } else if (arrObject[i].name === 'timestamp') { // 滤芯
                if (arrObject[i].data >= 4320) {
                  self.lvxin1 = false;
                } else {
                  self.lvxin1 = true;
                  self.timestamp1 = window.parseInt(arrObject[i].data / 24);
                }
              } else if (arrObject[i].name === 'timestamp2') { // 滤芯2
                if (arrObject[i].data >= 4320) {
                  self.lvxin2 = false;
                } else {
                  self.lvxin2 = true;
                  self.timestamp2 = window.parseInt(arrObject[i].data / 24);
                }
              } else if (arrObject[i].name === 'pm2dot5') { // pm2.5
                self.pm2dot5 = arrObject[i].data;
              } else if (arrObject[i].name === 'wind_temp') { // 送风温度
                self.current_temp = arrObject[i].data;
              }
            }
          }
        },
        (err) => {
          window.SmartSDK.toast(err.error.errorInfo);
          self.current_temp = '---';
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
          } else if (arrObject[i].name === 'purifymode') { // 模式
            if (arrObject[i].data === 'new_air') { // 新风
              self.grid_active_id = 1;
              self.mode_text = '新风';
            } else if (arrObject[i].data === 'mix') { // 混合风
              self.grid_active_id = 2;
              self.mode_text = '综合';
            } else if (arrObject[i].data === 'internal_circulate') { // 内循环
              self.grid_active_id = 3;
              self.mode_text = '净化';
            }
          } else if (arrObject[i].name === 'wind') { // 风速
            let texts = '';
            const valueS = arrObject[i].data;
            let nums = 1;
            if (valueS === 'low') {
              texts = '低';
              nums = 1;
            } else if (valueS === 'medium') {
              texts = '中';
              nums = 2;
            } else if (valueS === 'high') {
              texts = '高';
              nums = 3;
            }
            self.wind_sty = texts;
            self.range_data_array.value = { value: nums, text: texts };
          } else if (arrObject[i].name === 'timestamp') { // 滤芯
            if (arrObject[i].data >= 4320) {
              self.lvxin1 = false;
            } else {
              self.lvxin1 = true;
              self.timestamp1 = window.parseInt(arrObject[i].data / 24);
            }
          } else if (arrObject[i].name === 'timestamp2') { // 滤芯2
            if (arrObject[i].data >= 4320) {
              self.lvxin2 = false;
            } else {
              self.lvxin2 = true;
              self.timestamp2 = window.parseInt(arrObject[i].data / 24);
            }
          } else if (arrObject[i].name === 'pm2dot5') { // pm2.5
            self.pm2dot5 = arrObject[i].data;
          } else if (arrObject[i].name === 'wind_temp') { // 温度
            self.current_temp = arrObject[i].data;
          }
        }
      }
    },
    getEorForSnapshot(err) {
      // window.SmartSDK.toast(JSON.stringify(err));
      window.SmartSDK.toast(err.error.errorInfo);
      self.current_temp = '---';
    },
    resets(nums) {
      let names = 'timestamp';
      if (nums === 1) {
        names = 'timestamp';
      } else {
        names = 'timestamp2';
      }
      const datas = [{ name: names, type: 'i', data: 0, len: 4 }];
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
