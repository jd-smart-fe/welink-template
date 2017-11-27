<template>
  <div id="app">
    <!-- 头部显示 -->
    <header  style="width:100%;" >
      <!-- <div style="border-radius:50%; width:2rem; height:2rem; border:0.3rem solid #666;margin:20px auto;"></div> -->
      <div class="baseDiv blue-bg">
        <div class="insideDiv">
          <div class="numbs">
            <span>{{pressure}}</span> 百帕
            <p>当前气压值</p>
          </div>
        </div>
        <div class="ellipse rotate90"></div>
        <div class="ellipse rotate120"></div>
        <div class="ellipse rotate60"></div>
      </div>
    </header>
    <div class="report">
      <span><em class="icon icons"></em>检测报告</span>
      <p>空气压力和海拔高度、气候变化有关。雾霾天气，打开新风保持室内气压高于室外，可防止污染物渗入。</p>
    </div>
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
      pressure: '--',
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
              if (arrObject[i].name === 'pressure') { // 开关
                const pra = (arrObject[i].data / 100).toFixed(1);
                self.pressure = pra;
              }
            }
          }
        },
        (err) => {
          window.SmartSDK.toast(err.error.errorInfo);
          self.pressure = '--';
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
          if (arrObject[i].name === 'pressure') { // 开关
            const pra = (arrObject[i].data / 100).toFixed(1);
            self.pressure = pra;
          }
        }
      }
    },
    getEorForSnapshot(err) {
      window.SmartSDK.toast(err.error.errorInfo);
    },
  },
};

</script>

<style>
body{
background: rgb(255, 255, 255);
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}
.icons{
    display: inline-block;
    width:0.2rem;
    height: 0.2rem;
    margin-right: 0.05rem;
    background:url("images/icons.png") no-repeat center;
    background-size: 100%;
}
</style>
