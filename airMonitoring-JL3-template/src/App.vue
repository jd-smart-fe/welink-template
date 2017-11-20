<template>
  <div id="app">
    <!-- 头部显示 -->
    <header  style="width:100%;" >
      <!-- <div style="border-radius:50%; width:2rem; height:2rem; border:0.3rem solid #666;margin:20px auto;"></div> -->
      <div class="baseDiv" :class="massColor">
        <div class="insideDiv">
          <div class="texts">
            {{massText}}
          </div>
        </div>
        <div class="ellipse rotate90"></div>
        <div class="ellipse rotate120"></div>
        <div class="ellipse rotate60"></div>
      </div>
    </header>
    <!--检测列表-->
    <!-- <div></div> -->
    <div class="lists">
      <ul>
        <li id="ones"  @click="doShow('ones')">
         <span :class="tempc">{{inTempText}}</span><em :class="tempc">°C</em>
         <p>室内温度</p>
        </li>
        <li id="twos"  @click="doShow('twos')" >
         <span :class="humidityc">{{inHumidity}}</span><em :class="humidityc">％</em>
         <p>室内湿度</p>
        </li>
        <li id="thrs"  @click="doShow('thrs')" >
         <span :class="pm25c">{{pm25Text}}</span>
         <p>PM2.5</p>
        </li>
      </ul>
      <ul>
        <li id="fours"  @click="doShow('fours')">
         <span :class="co2c">{{co2Text}}</span><em :class="co2c">ppm</em>
         <p>CO2浓度</p>
        </li>
         <li id="fives"  @click="doShow('fives')">
         <span :class="tvocc">{{tvocText}}</span>
         <p>TVOC</p>
        </li>
         <li id="sixs"  @click="doShow('sixs')">
         <span :class="forhydec">{{formaldehydeText}}</span>
         <p>甲醛</p>
        </li>
      </ul>
    </div>
    <!--健康提醒-->
    <div class="desc">
      <span :class="descCol">{{decsTiTle}}</span>
      <p>{{decsText}}</p>
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
      massText: '优',
      massColor: 'green-bg',
      inTempText: '--',
      inHumidity: '--',
      pm25Text: '--',
      co2Text: '--',
      tvocText: '--',
      formaldehydeText: '--',
      decsText: '--',
      decsTiTle: '--',
      massSet: 1,
      massGet: 1,
      falgtag: [],
      tvocc: 'nal',
      co2c: 'nal',
      tempc: 'nal',
      humidityc: 'nal',
      forhydec: 'nal',
      pm25c: 'nal',
      strTemp: '',
      strHumidity: '',
      strPm2dot5: '',
      strCo2: '',
      strTvoc: '',
      strFormaldehyde: '',
      descCol: 'nal',
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
            self.massGet = 1;
            self.falgtag = [];
            for (let i = 0; i < arrObject.length; i += 1) {
              if (arrObject[i].name === 'temp') { // 温度
                self.inTempText = arrObject[i].data;
                let massds = 1;
                if (arrObject[i].data <= 18) {
                  massds = 2;
                  self.strTemp = '室内温度低，建议打开取暖器或空调。';
                } else if (arrObject[i].data > 18 && arrObject[i].data <= 30) {
                  massds = 1;
                  self.strTemp = '室内温度舒适。';
                } else if (arrObject[i].data > 30) {
                  massds = 2;
                  self.strTemp = '室内温度高，建议打开空调。';
                }
                if (massds > 2) {
                  self.tempc = 'reds';
                } else {
                  self.tempc = 'nal';
                }
                self.falgtag.push({ name: 'ones', nums: massds });
                if (self.massGet < massds) {
                  self.massGet = massds;
                }
                // 判断 等级及设置提醒文案
              } else if (arrObject[i].name === 'humidity') { // 湿度
                self.inHumidity = arrObject[i].data;
                let massds = 1;
                if (arrObject[i].data <= 30) {
                  massds = 2;
                  self.strHumidity = '空气干燥，注意多喝水，打开加湿器。';
                } else if (arrObject[i].data > 30 && arrObject[i].data <= 80) {
                  massds = 1;
                  self.strHumidity = '空气湿度处于舒适范围。';
                } else if (arrObject[i].data > 80) {
                  massds = 2;
                  self.strHumidity = '空气潮湿，建议打开除湿机或空调除湿模式。';
                }
                if (massds > 2) {
                  self.humidityc = 'reds';
                } else {
                  self.humidityc = 'nal';
                }
                self.falgtag.push({ name: 'twos', nums: massds });
                if (self.massGet < massds) {
                  self.massGet = massds;
                }
                 // 判断 等级及设置提醒文案
              } else if (arrObject[i].name === 'pm2dot5') { // pm2.5
                self.pm25Text = arrObject[i].data;
                let massds = 1;
                if (arrObject[i].data <= 50) {
                  massds = 1;
                  self.strPm2dot5 = '可吸入颗粒物浓度，值越低空气越清新。';
                } else if (arrObject[i].data > 50 && arrObject[i].data <= 100) {
                  massds = 2;
                  self.strPm2dot5 = '可吸入颗粒物浓度较高，请打开空气净化器。';
                } else if (arrObject[i].data > 100 && arrObject[i].data <= 300) {
                  massds = 3;
                  self.strPm2dot5 = '可吸入颗粒物浓度高，请打开空气净化器。';
                } else if (arrObject[i].data > 300) {
                  massds = 4;
                  self.strPm2dot5 = '可吸入颗粒物浓度严重偏高，请打开空气净化器。';
                }
                if (massds > 2) {
                  self.pm25c = 'reds';
                } else {
                  self.pm25c = 'nal';
                }
                self.falgtag.push({ name: 'thrs', nums: massds });
                if (self.massGet < massds) {
                  self.massGet = massds;
                }
                // 判断 等级及设置提醒文案
              } else if (arrObject[i].name === 'co2') { // 二氧化碳
                self.co2Text = arrObject[i].data;
                let massds = 1;
                if (arrObject[i].data <= 1000) {
                  massds = 1;
                  self.strCo2 = '二氧化碳浓度，数值越低空气越清新。';
                } else if (arrObject[i].data > 1000 && arrObject[i].data <= 2000) {
                  massds = 2;
                  self.strCo2 = '室内空气浑浊，请打开门窗或开启新风。';
                } else if (arrObject[i].data > 2000) {
                  massds = 3;
                  self.strCo2 = '室内二氧化碳浓度高，危害健康，请打开门窗或开启新风';
                }
                if (massds > 2) {
                  self.co2c = 'reds';
                } else {
                  self.co2c = 'nal';
                }
                self.falgtag.push({ name: 'fours', nums: massds });
                if (self.massGet < massds) {
                  self.massGet = massds;
                }
                // 判断 等级及设置提醒文案
              } else if (arrObject[i].name === 'tvoc') { // 总挥发性有机物
                self.tvocText = arrObject[i].data;
                let massds = 1;
                if (arrObject[i].data <= 1) {
                  massds = 1;
                  self.strTvoc = '室内挥发性有机物含量，数值越低越好。';
                } else if (arrObject[i].data > 1 && arrObject[i].data <= 3) {
                  massds = 2;
                  self.strTvoc = '室内挥发性有机物含量偏高，建议通风。';
                } else if (arrObject[i].data > 3 && arrObject[i].data <= 25) {
                  massds = 3;
                  self.strTvoc = '室内挥发性有机物含量高，可能引发头痛等不适，建议通风。';
                } else if (arrObject[i].data > 25) {
                  massds = 4;
                  self.strTvoc = '室内挥发性有机物含量高，可能出现神经毒性作用，请立即通风。';
                }
                if (massds > 2) {
                  self.tvocc = 'reds';
                } else {
                  self.tvocc = 'nal';
                }
                self.falgtag.push({ name: 'fives', nums: massds });
                if (self.massGet < massds) {
                  self.massGet = massds;
                }
                // 判断 等级及设置提醒文案
              } else if (arrObject[i].name === 'formaldehyde') { // 甲醛
                let massds = 1;
                self.formaldehydeText = arrObject[i].data;
                if (arrObject[i].data <= 0.08) {
                  massds = 1;
                  self.strFormaldehyde = '甲醛浓度，一般由家具、油漆挥发，危害健康，数值越低越好。';
                } else if (arrObject[i].data > 0.08 && arrObject[i].data <= 0.5) {
                  massds = 2;
                  self.strFormaldehyde = '甲醛超标，危害儿童和老人，可能刺激眼睛， 引起流泪，请注意通风。';
                } else if (arrObject[i].data > 0.5 && arrObject[i].data <= 0.6) {
                  massds = 3;
                  self.strFormaldehyde = '甲醛超标，危害健康，可引起咽喉不适或疼 痛，请注意通风。';
                } else if (arrObject[i].data > 0.6) {
                  massds = 4;
                  self.strFormaldehyde = '甲醛严重超标，请通风后再入住。';
                }
                if (massds > 2) {
                  self.forhydec = 'reds';
                } else {
                  self.forhydec = 'nal';
                }
                self.falgtag.push({ name: 'sixs', nums: massds });
                if (self.massGet < massds) {
                  self.massGet = massds;
                }
                // 判断 等级及设置提醒文案
              }
            }
            self.massFunc();
            self.falgFirst();
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
          if (arrObject[i].name === 'temp') { // 温度
            self.inTempText = arrObject[i].data;
            let massds = 1;
            if (arrObject[i].data <= 18) {
              massds = 2;
              self.strTemp = '室内温度低，建议打开取暖器或空调。';
            } else if (arrObject[i].data > 18 && arrObject[i].data <= 30) {
              massds = 1;
              self.strTemp = '室内温度舒适。';
            } else if (arrObject[i].data > 30) {
              massds = 2;
              self.strTemp = '室内温度高，建议打开空调。';
            }
            self.falgtag.push({ name: 'ones', nums: massds });
            if (massds > 2) {
              self.tempc = 'reds';
            } else {
              self.tempc = 'nal';
            }
            if (self.massGet < massds) {
              self.massGet = massds;
            }
            // 判断 等级及设置提醒文案
          } else if (arrObject[i].name === 'humidity') { // 湿度
            self.inHumidity = arrObject[i].data;
            let massds = 1;
            if (arrObject[i].data <= 30) {
              massds = 2;
              self.strHumidity = '空气干燥，注意多喝水，打开加湿器。';
            } else if (arrObject[i].data > 30 && arrObject[i].data <= 80) {
              massds = 1;
              self.strHumidity = '空气湿度处于舒适范围。';
            } else if (arrObject[i].data > 80) {
              massds = 2;
              self.strHumidity = '空气潮湿，建议打开除湿机或空调除湿模式。';
            }
            self.falgtag.push({ name: 'twos', nums: massds });
            if (massds > 2) {
              self.humidityc = 'reds';
            } else {
              self.humidityc = 'nal';
            }
            if (self.massGet < massds) {
              self.massGet = massds;
            }
            // 判断 等级及设置提醒文案
          } else if (arrObject[i].name === 'pm2dot5') { // pm2.5
            self.pm25Text = arrObject[i].data;
            let massds = 1;
            if (arrObject[i].data <= 50) {
              massds = 1;
              self.strPm2dot5 = '可吸入颗粒物浓度，值越低空气越清新。';
            } else if (arrObject[i].data > 50 && arrObject[i].data <= 100) {
              massds = 2;
              self.strPm2dot5 = '可吸入颗粒物浓度较高，请打开空气净化器。';
            } else if (arrObject[i].data > 100 && arrObject[i].data <= 300) {
              massds = 3;
              self.strPm2dot5 = '可吸入颗粒物浓度高，请打开空气净化器。';
            } else if (arrObject[i].data > 300) {
              massds = 4;
              self.strPm2dot5 = '可吸入颗粒物浓度严重偏高，请打开空气净化器。';
            }
            self.falgtag.push({ name: 'thrs', nums: massds });
            if (massds > 2) {
              self.pm25c = 'reds';
            } else {
              self.pm25c = 'nal';
            }
            if (self.massGet < massds) {
              self.massGet = massds;
            }
            // 判断 等级及设置提醒文案
          } else if (arrObject[i].name === 'co2') { // 二氧化碳
            self.co2Text = arrObject[i].data;
            let massds = 1;
            if (arrObject[i].data <= 1000) {
              massds = 1;
              self.strCo2 = '二氧化碳浓度，数值越低空气越清新。';
            } else if (arrObject[i].data > 1000 && arrObject[i].data <= 2000) {
              massds = 2;
              self.strCo2 = '室内空气浑浊，请打开门窗或开启新风。';
            } else if (arrObject[i].data > 2000) {
              massds = 3;
              self.strCo2 = '室内二氧化碳浓度高，危害健康，请打开门窗或开启新风';
            }
            self.falgtag.push({ name: 'fours', nums: massds });
            if (massds > 2) {
              self.co2c = 'reds';
            } else {
              self.co2c = 'nal';
            }
            if (self.massGet < massds) {
              self.massGet = massds;
            }
            // 判断 等级及设置提醒文案
          } else if (arrObject[i].name === 'tvoc') { // 总挥发性有机物
            self.tvocText = arrObject[i].data;
            let massds = 1;
            if (arrObject[i].data <= 1) {
              massds = 1;
              self.strTvoc = '室内挥发性有机物含量，数值越低越好。';
            } else if (arrObject[i].data > 1 && arrObject[i].data <= 3) {
              massds = 2;
              self.strTvoc = '室内挥发性有机物含量偏高，建议通风。';
            } else if (arrObject[i].data > 3 && arrObject[i].data <= 25) {
              massds = 3;
              self.strTvoc = '室内挥发性有机物含量高，可能引发头痛等不适，建议通风。';
            } else if (arrObject[i].data > 25) {
              massds = 4;
              self.strTvoc = '室内挥发性有机物含量高，可能出现神经毒性作用，请立即通风。';
            }
            self.falgtag.push({ name: 'fives', nums: massds });
            if (massds > 2) {
              self.tvocc = 'reds';
            } else {
              self.tvocc = 'nal';
            }
            if (self.massGet < massds) {
              self.massGet = massds;
            }
            // 判断 等级及设置提醒文案
          } else if (arrObject[i].name === 'formaldehyde') { // 甲醛
            self.formaldehydeText = arrObject[i].data;
            let massds = 1;
            if (arrObject[i].data <= 0.08) {
              massds = 1;
              self.strFormaldehyde = '甲醛浓度，一般由家具、油漆挥发，危害健康，数值越低越好。';
            } else if (arrObject[i].data > 0.08 && arrObject[i].data <= 0.5) {
              massds = 2;
              self.strFormaldehyde = '甲醛超标，危害儿童和老人，可能刺激眼睛， 引起流泪，请注意通风。';
            } else if (arrObject[i].data > 0.5 && arrObject[i].data <= 0.6) {
              massds = 3;
              self.strFormaldehyde = '甲醛超标，危害健康，可引起咽喉不适或疼 痛，请注意通风。';
            } else if (arrObject[i].data > 0.6) {
              massds = 4;
              self.strFormaldehyde = '甲醛严重超标，请通风后再入住。';
            }
            self.falgtag.push({ name: 'sixs', nums: massds });
            if (massds > 1) {
              self.forhydec = 'reds';
            } else {
              self.forhydec = 'nal';
            }
            if (self.massGet < massds) {
              self.massGet = massds;
            }
            // 判断 等级及设置提醒文案
          }
        }
        self.massFunc();
        self.falgFirst();
        // 设置快照默认提醒
      }
    },
    getEorForSnapshot(err) {
      window.SmartSDK.toast(err.error.errorInfo);
    },
    massFunc() {
      if (this.massGet === 1) {
        this.massText = '优';
        this.massColor = 'green-bg';
      } else if (this.massGet === 2) {
        this.massText = '良';
        this.massColor = 'liang-bg';
      } else if (this.massGet === 3) {
        this.massText = '中';
        this.massColor = 'zhong-bg';
      } else if (this.massGet === 4) {
        this.massText = '差';
        this.massColor = 'cha-bg';
      }
    },
    falgFirst() {
      // this.falgtag  通过nums作排序选第一个名称
      const self = this;
      const types = self.falgtag.sort(self.sortRules)[0].name;
      const lists = document.querySelectorAll('li');
      for (let i = 0; i < lists.length; i += 1) {
        lists[i].setAttribute('class', '');
      }
      document.querySelector(`#${types}`).setAttribute('class', 'lia');
      if (types === 'ones') {
        self.decsTiTle = '室内温度';
        self.decsText = self.strTemp;
        self.descCol = self.tempc;
      } else if (types === 'twos') {
        self.decsTiTle = '室内湿度';
        self.decsText = self.strHumidity;
        self.descCol = self.humidityc;
      } else if (types === 'thrs') {
        self.decsTiTle = 'PM2.5';
        self.decsText = self.strPm2dot5;
        self.descCol = self.pm25c;
      } else if (types === 'fours') {
        self.decsTiTle = 'CO2浓度';
        self.decsText = self.strCo2;
        self.descCol = self.co2c;
      } else if (types === 'fives') {
        self.decsTiTle = 'TVOC';
        self.decsText = self.strTvoc;
        self.descCol = self.tvocc;
      } else if (types === 'sixs') {
        self.decsTiTle = '甲醛';
        self.decsText = self.strFormaldehyde;
        self.descCol = self.forhydec;
      }
    },
    doShow(val) {
      const self = this;
      const lists = document.querySelectorAll('li');
      for (let i = 0; i < lists.length; i += 1) {
        lists[i].setAttribute('class', '');
      }
      window.console.log(document.querySelector(`#${val}`));
      document.querySelector(`#${val}`).setAttribute('class', 'lia');
      if (val === 'ones') {
        self.decsTiTle = '室内温度';
        self.decsText = self.strTemp;
        self.descCol = self.tempc;
      } else if (val === 'twos') {
        self.decsTiTle = '室内湿度';
        self.decsText = self.strHumidity;
        self.descCol = self.humidityc;
      } else if (val === 'thrs') {
        self.decsTiTle = 'PM2.5';
        self.decsText = self.strPm2dot5;
        self.descCol = self.pm25c;
      } else if (val === 'fours') {
        self.decsTiTle = 'CO2浓度';
        self.decsText = self.strCo2;
        self.descCol = self.co2c;
      } else if (val === 'fives') {
        self.decsTiTle = 'TVOC';
        self.decsText = self.strTvoc;
        self.descCol = self.tvocc;
      } else if (val === 'sixs') {
        self.decsTiTle = '甲醛';
        self.decsText = self.strFormaldehyde;
        self.descCol = self.forhydec;
      }
    },
    sortRules(a, b) {
      return b.nums - a.nums;
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
</style>
