<template>
  <div id="app">
    <!-- 头部显示 -->
    <header class="blue_bg" style="width:100%">
      <ul :class="ultype" >
        <li v-for="(val, index) in stat_text" :key="val.id">
          <p>开关{{val.id}}</p>
          <span>{{val.text}}</span>
        </li>
      </ul>
    </header>
    <v-panel v-for="(val, index) in stat_flag" :key="index">
      <div slot="body" class="c-panel-body row-2 u-cross-center">
        <div slot="title" class="c-panel-title" style="color:#59b8fc">
          <span>开关{{index + 1}}</span>
        </div>
        <v-switch :hold="true" ref="power_data" v-model="stat_flag[index]" @change="dosometing(val, index)"></v-switch>
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
      ultype: 'ones',
      power_value: false,
      mask_show: false,
      text_power: '灯已开启',
      statusarr: ['off'],
      stat_text: [],
      stat_flag: [false],
    };
  },
  mounted() {
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
    dosometing(val, index) {
      let strs;
      if (!val) {
        strs = 'on';
      } else {
        strs = 'off';
      }
      this.statusarr[index] = strs;
      window.console.log(this.stat_flag[index]);
      const datas = [{ name: 'switch_multi', type: 'as', data: this.statusarr, len: 0 }];
      window.SmartSDK.controlDevice(datas,
        (data) => {
          window.console.log(data);
          this.$set(this.stat_flag, index, !val);
        },
        (err) => {
          window.SmartSDK.toast(err.error.errorInfo);
        });
    },
    funs(num) {
      return this.stat_flag[num];
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
          if (data.result.data !== '') {
            if (data.result.data.member.name === 'status' && data.result.data.member.type === 'signal') {
              let arrObject = data.result.data.in;
              if (typeof (arrObject) === 'string') {
                arrObject = JSON.parse(arrObject);
              }
              for (let i = 0; i < arrObject.length; i += 1) {
                if (arrObject[i].name === 'switch_multi') { // 获取开关状态
                  let arrM;
                  if (typeof (arrObject[i].data) === 'string') {
                    arrM = JSON.parse(arrObject[i].data);
                  }
                  arrM = arrObject[i].data;
                  self.statusarr = arrM;
                  const setArr = [];
                  self.stat_flag = [];
                  for (let j = 0; j < arrM.length; j += 1) {
                    if (arrM[j] === 'on') {
                      setArr.push({ text: '开启', id: (j + 1) });
                      self.$set(self.stat_flag, j, true);
                    } else {
                      setArr.push({ text: '关闭', id: (j + 1) });
                      self.$set(self.stat_flag, j, false);
                    }
                    self.stat_text = setArr;
                    if (self.stat_text.length === 2) {
                      self.ultype = 'twos';
                    } else if (self.stat_text.length === 3) {
                      self.ultype = 'threes';
                    } else if (self.stat_text.length === 4) {
                      self.ultype = 'fours';
                    } else {
                      self.ultype = 'ones';
                    }
                  }
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
          if (arrObject[i].name === 'switch_multi') { // 获取开关状态
            let arrM = '';
            if (typeof (arrObject[i].data) === 'string') {
              arrM = JSON.parse(arrObject[i].data);
            }
            arrM = arrObject[i].data;
            self.statusarr = arrM;
            const setArr = [];
            for (let j = 0; j < arrM.length; j += 1) {
              if (arrM[j] === 'on') {
                setArr.push({ text: '开启', id: (j + 1) });
                self.$set(self.stat_flag, j, true);
              } else {
                setArr.push({ text: '关闭', id: (j + 1) });
                self.$set(self.stat_flag, j, false);
              }
              self.stat_text = setArr;
              if (self.stat_text.length === 2) {
                self.ultype = 'twos';
              } else if (self.stat_text.length === 3) {
                self.ultype = 'threes';
              } else if (self.stat_text.length === 4) {
                self.ultype = 'fours';
              } else {
                self.ultype = 'ones';
              }
            }
          }
        }
      }
    },
    getEorForSnapshot(err) {
      window.SmartSDK.toast(err.error.errorInfo);
    },
    showTimer() {
      this.mshown = true;
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
