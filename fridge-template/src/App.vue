<template>
  <div id="app">

    <!-- debug -->
    <div class="debug-button" @click="showDebugInfo += 1"></div>
    <div id="debugarea" v-show="showDebugInfo > 10">
      <button @click="showDebugInfo = 0"> close </button>
      <button @click="info = ''"> clearInfo </button>
      <button @click="offline = false"> closeMask </button>
      <textarea id="textarea" style="width: 100%; height: 300px;" v-model="info">
      </textarea>
    </div>

    <!-- 头部 -->
    <header-com @click.native="showDebugInfo += 1" title1="冷藏" :value1="fritemp" :close1="!fripower" title2="变温" :value2="vartemp" title3="冷冻" :value3="fretemp" />

    <!-- 提示模式运行 -->
    <div class="tips">
      <div :class="['tips-item', smartmode ? 'show' : '']">
        <span class="tips-icon icon-smartmode-running">
        </span>
        <span>智能模式运行中</span>
      </div>
      <div :class="['tips-item', fastfrimode ? 'show' : '']">
        <span class="tips-icon icon-fastfrimode-running">
        </span>
        <span>速冷模式运行中</span>
      </div>
      <div :class="['tips-item', fastfremode ? 'show' : '']">
        <span class="tips-icon icon-fastfremode-running" >
        </span>
        <span>速冻模式运行中</span>
      </div>
    </div>

    <!-- 模式选择 -->
    <div class="">
      <board title="模式选择">
        <div class="mode">
          <div>
            <mode-button
              :title="smartmodeTitle"
              :iconCls="smartmodeIconCls"
              @click.native="controlModeButton('smartmode')"
            />
          </div>
          <div>
            <mode-button
              :title="fastfrimodeTitle"
              :iconCls="fastfrimodeIconCls"
              :disabled="fastfrimodeDisabled"
              @click.native="controlModeButton('fastfrimode')"
            />
          </div>
          <div>
            <mode-button
              :title="fastfremodeTitle"
              :iconCls="fastfremodeIconCls"
              @click.native="controlModeButton('fastfremode')"
            />
          </div>
        </div>
      </board>

      <!-- 冰箱室 -->
      <board title="冷藏室"
        :hasSwitch="true"
        :num="fritemp"
        :close="!fripower"
        :disabled="false"
        :switchValue="fripower"
        @changeSwitch="handleSwitch('fripower')"
      >
        <range-box
          :begin="2"
          :end="8"
          :min="2"
          :max="8"
          :val="fritemp"
          :disabled="!fripower"
          ref="fritemp"
        />
      </board>

      <board
        title="变温室"
        :num="vartemp"
        :close="!varpower"
        :disabled="false"
        :switchValue="varpower"
        @changeSwitch="handleSwitch('varpower')"
      >
        <range-box
          :begin="-7"
          :end="5"
          :min="-7"
          :max="5"
          :val="vartemp"
          :disabled="!varpower"
          ref="vartemp"
        />
      </board>

      <board
        title="冷冻室"
        :num="fretemp"
      >
        <range-box
          :begin="-24"
          :end="-16"
          :min="-24"
          :max="-16"
          :val="fretemp"
          ref="fretemp"
        />
      </board>
    </div>

    <comfirm v-show="confirmShow" :title="confirmShowTitle" :content="confirmContent" @cancel="handleConfirmCancel" @accept="handleConfirmAccept" />

    <Loading v-model="loadingShow" />
    <Masks :show="offline"></Masks>
  </div>
</template>

<script>
import HeaderCom from './components/Header';
import Board from './components/Board';
import ModeButton from './components/ModeButton';
import RangeBox from './components/RangeBox';
import Comfirm from './components/Comfirm';
import Loading from './components/Loading';
import Masks from './components/Mask';
import './libs/page-visibility';

export default {
  name: 'app',
  components: {
    HeaderCom,
    Board,
    ModeButton,
    RangeBox,
    Comfirm,
    Loading,
    Masks,
  },

  data() {
    return {
      // 温度相关
      fritemp: '5',
      vartemp: '-8',
      fretemp: '-18',
      // 各个模式的 icon 类名
      smartmodeIconCls: 'icon-smartmode',
      fastfrimodeIconCls: 'icon-fastfrimode',
      fastfremodeIconCls: 'icon-fastfremode',
      // 各个模式的开关
      smartmode: false,
      fastfrimode: false,
      fastfremode: false,
      // 各个模式的标题
      smartmodeTitle: '智能模式',
      fastfrimodeTitle: '速冷模式',
      fastfremodeTitle: '速冻模式',
      // 各个模式的禁用状态
      fastfrimodeDisabled: false,
      // 冰箱室开关
      fripower: true,
      varpower: true,
      // confirm
      confirmShow: false,
      confirmShowTitle: '',
      confirmContent: '',
      // 展示 loading
      loadingShow: false,
      // 是否离线
      offline: false,
      // 调试用
      showDebugInfo: 0,
      info: '',
    };
  },

  watch: {
    smartmode(val) {
      if (val) {
        this.smartmodeTitle = '关闭智能';
        this.smartmodeIconCls = 'icon-smartmode-active';
      } else {
        this.smartmodeTitle = '智能模式';
        this.smartmodeIconCls = 'icon-smartmode';
      }
    },

    fastfrimode(val) {
      if (val) {
        this.fastfrimodeTitle = '关闭速冷';
        this.fastfrimodeIconCls = 'icon-fastfrimode-active';
      } else {
        this.fastfrimodeTitle = '速冷模式';
        this.fastfrimodeIconCls = 'icon-fastfrimode';
      }
    },

    fastfremode(val) {
      if (val) {
        this.fastfremodeTitle = '关闭速冻';
        this.fastfremodeIconCls = 'icon-fastfremode-active';
      } else {
        this.fastfremodeTitle = '速冻模式';
        this.fastfremodeIconCls = 'icon-fastfremode';
      }
    },

    fripower(val) {
      if (!val) {
        this.fastfrimodeIconCls = 'icon-fastfrimode-disabled';
        this.fastfrimodeDisabled = true;
      } else {
        this.fastfrimodeIconCls = 'icon-fastfrimode';
        this.fastfrimodeDisabled = false;
      }
    },

    offline(val) {
      if (!val) {
        window.smartSDK.setNavigationConfig({ showOnline: false });
        return;
      }
      this.$toast.show({
        text: '冰箱已断开连接',
        duration: 3000,
      });
      window.smartSDK.setNavigationConfig({ showOnline: true });
    },
  },

  created() {
    window.JDSMART.ready(() => {
      // 获取设备快照
      this.getSnapshot();
    });

    // 页面可见性变化时需要重新获取快照更新UI
    window.pageVisibility.visibilitychange(() => {
      if (window.pageVisibility.hidden === false) {
        this.debug('visibility change');
        this.getSnapshot();
      }
    });
  },

  mounted() {
    window.onReceive = rowData => {
      this.debug('onReceiveTimes', rowData);
      const data = typeof rowData === 'string'
        ? JSON.parse(rowData)
        : rowData;
      if (!data) return;

      const indata = data.body.data;
      this.offlineFilter(indata);
      if (indata.result.status == 1 && indata.result.streams.length > 0) {
        this.offline = false;
        this.loadingShow = false;
        this.updateView(indata);
      }
    };

    ['fritemp', 'fretemp', 'vartemp'].forEach((item) => {
      this.$refs[item].$on('change_value', val => {
        this[item] = val;
      });
      this.$refs[item].$on('final_change', val => {
        this.controlDevice({ [item]: val });
      });
    });
  },

  methods: {
    fullMap(streams) {
      const propMap = {};
      for (const item of streams) {
        propMap[item.stream_id] = item.current_value;
      }
      return propMap;
    },

    updateView(data) {
      const propMap = typeof data.result === 'object'
        ? this.fullMap(data.result.streams)
        : this.fullMap(JSON.parse(data.result).streams);

      // 同步模式
      const modelist = [];
      ['smartmode', 'fastfrimode', 'fastfremode', 'holidaymode'].forEach(mode => {
        if (this[mode] !== undefined) {
          modelist.push(mode);
        }
      });
      modelist.forEach(mode => {
        this[mode] = window.parseInt(propMap[mode]) === 1;
      });

      // 同步温度
      ['fritemp', 'fretemp', 'vartemp'].forEach((temp) => {
        if (typeof this[temp] !== 'undefined') {
          typeof propMap[temp] !== 'undefined'
            ? this[temp] = propMap[temp] : '';
        }
      });

      // 冰箱室开关
      ['fripower', 'varpower', 'frepower'].forEach((item) => {
        if (typeof this[item] !== 'undefined') {
          const power = parseFloat(propMap[item], 10);
          if (!isNaN(power)) {
            this[item] = power === 1;
          }
        }
      });
    },

    handleSwitch(val) {
      const fripowerText = '如果冷藏室还有食物，请及时清理，以免食物变质！';
      const strategies = {
        fripower: {
          content: '如果冷藏室还有食物，请及时清理，以免食物变质！',
        },
        varpower: {
          content: '如果变温室还有食物，请及时清理，以免食物变质！',
        },
      };

      if (this[val]) {
        this.confirmShowTitle = '确认关闭吗？';
        this.confirmContent = strategies[val].content;
        this.confirmShow = true;
      } else {
        this.controlDevice({ [val]: 1 });
      }
    },

    controlModeButton(mode) {
      this.controlDevice({ [mode]: this[mode] ? 0 : 1 });
    },

    handleConfirmCancel() {
      this.confirmShow = false;
    },

    handleConfirmAccept() {
      this.controlDevice({ fripower: 0 });
      this.confirmShow = false;
    },

    getSnapshot(success, fail) {
      window.smartSDK.getSnapshot(null, data => {
        this.debug('getSnapshotTimes', data);
        this.updateView(data);

        const result = typeof data.result === 'string'
          ? JSON.parse(data.result)
          : data.result;

        // 离线判断
        if (result.status != 1) {
          this.offline = true;
        }

        typeof success === 'function' ? success(data) : 0;

      }, e => {
        typeof fail === 'function' ? fail(e) : 0;
      });
    },

    controlDevice(cmd, success, fail) {
      this.debug('controlDevice_req', cmd);
      const command = window.smartSDK.getCommand(cmd);
      this.loadingShow = true;

      window.smartSDK.controlDevice(command, rowData => {

        const data = typeof rowData === 'string' ? JSON.parse(rowData) : rowData;

        this.debug('controlDevice_res', data);
        this.loadingShow = false;
        this.updateView(data);

        typeof success === 'function' ? success(data) : 0;

      }, rowError => {
        const error = typeof rowError === 'string' ? JSON.parse(rowError) : rowError;

        this.debug('controlDevice_res_error', error);

        if (this.loadingShow === false) return;   // 详见 注释一

        this.loadingShow = false;
        if (!error) return;  // 未成功加载桥文件会出现 error === undefined

        // errorCode == 2004 则代表设备已经离线
        // 因为设备离线时 offline watcher 已经弹出 toast 了，所以这里不用额外弹出 toast。
        if (error.errorCode != 2004) {
          this.$toast.show(error.errorInfo);
        }

        this.getSnapshot();   // 再取一次快照
        typeof fail === 'function' ? fail(error) : 0;  // 失败回调
      });
    },

    debug(...p) {
      const time = new Date();
      const logs = p.map(log => typeof log === 'string' ? log : JSON.stringify(log));
      logs.unshift(time.toLocaleString());
      this.info += `==========\n${logs.join('\n')}\n==========`
    },
  },
};

</script>

<style lang="postcss">
  body {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #eee;
  color: #333;
  font-size: .14rem;
  -webkit-user-select: none;
  user-select: none;
  }

  .mode {
    display: flex;
    height: 100%;

    >div {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .mode-border > div +div {
    border-left: 1px solid #eaeaea;
  }

  .icon-smartmode {
    background-image: url(./assets/img/smartmode.png);
  }
  .icon-smartmode-active {
    background-image: url(./assets/img/smartmode_active.png);
  }
  .icon-smartmode-disabled {
    background-image: url(./assets/img/smartmode_disabled.png);
  }
  .icon-smartmode-running {
    background-image: url(./assets/img/smartmode_running.png);
  }

  .icon-fastfrimode {
    background-image: url(./assets/img/fastfrimode.png);
  }
  .icon-fastfrimode-active {
    background-image: url(./assets/img/fastfrimode_active.png);
  }
  .icon-fastfrimode-disabled {
    background-image: url(./assets/img/fastfrimode_disabled.png);
  }
  .icon-fastfrimode-running {
    background-image: url(./assets/img/fastfrimode_running.png);
  }

  .icon-fastfremode {
    background-image: url(./assets/img/fastfremode.png);
  }
  .icon-fastfremode-active {
    background-image: url(./assets/img/fastfremode_active.png);
  }
  .icon-fastfremode-disabled {
    background-image: url(./assets/img/fastfremode_disabled.png);
  }
  .icon-fastfremode-running {
    background-image: url(./assets/img/fastfremode_running.png);
  }

  .tips {
    color: #f37611;
    font-size: .15rem;
    text-align: center;
    line-height: .3rem;
    height: 0;
    transition: height .5s ease-out;
    overflow: hidden;

    &.show {
      height: .3rem;
    }
  }

  .tips-icon {
    display: inline-block;
    width: .2rem;
    height: .2rem;
    margin-right: .07rem;
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    vertical-align: -11%;
  }

  .debug-button {
    width: 50px;
    height: 50px;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 9999;
  }
  #debugarea {
    position: relative;
    z-index: 99999;
  }
</style>
