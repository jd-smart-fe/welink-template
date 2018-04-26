<template>
  <div id="app">
    <section id="page1">
    <!-- 执行记录 -->
     <v-panel class="logitem_panel">
        <div slot="body" class="c-panel-body row-1 u-cross-center" >
          <div class="text">执行记录</div>
          <span class='icon icon-pull-right' @click="getLogList"></span>
        </div>
      </v-panel>
    <!--定时任务-->
      <!--无任务显示-->
      <div v-show="taskno"><div class="notask" ></div>暂无设置定时<br>
      <span  style="color:#999">点击页面右上方“＋”新建定时任务</span></div>
       <!--有任务显示-->
       <div class="lists" v-show="!taskno">
       <v-panel v-for="(task, index) in tasksLst" :key="index">
        <div slot="header" class="c-panel-header ">
          <div class="c-panel-title task_name" >{{task.name}}</div>
          <div class="c-panel-extra">
            <span class='imgs' @click="tshowAction(index)"></span>
          </div>
        </div>
        <div slot="body" class="c-panel-body u-cross-center ">
         <div class="row-2" style="position:relative;">
           <div class="task_time" :class="task.color">{{task.time}}</div>
           <div class="task_date">{{task.date}}</div>
         </div>
         <v-switch  v-show="!task.Expired"  :value="task.isTrue" ref="asyncSwitch"
         :hold="true" @click.native="doit(index)"
         ></v-switch>
         <div v-show="task.Expired"  class="task_Expired">已过期</div>
       </div>
     </v-panel>
   </div>
   <v-action-sheet
      ref="action" v-model="showAction"  :items="items" @change="updateInfo" ></v-action-sheet>
    </section>
    <!--定时设置页面-->
    <section id="page2" style="display:none;">
      <v-panel style="margin-top:5px;">
        <div slot="body">
          <v-picker ref="ipicker"  mode="inline"
            :items="items_for_inline"  @change="updateTime">
          </v-picker>
        </div>
    </v-panel>
    <v-panel>
      <div slot="body" class="c-panel-body row-1 u-cross-center" >
        <div class="settaskname">重复</div>
        <div class="c-timer-content settasktext">{{task_type_text}}
          <span class='icon icon-pull-right' @click="toRepeatPage"></span>
        </div>
      </div>
    </v-panel>
    <v-panel v-show="!taskName">
      <div slot="body" class="c-panel-body row-1 u-cross-center" >
        <div class="settaskname">定时任务</div>
        <div class="c-timer-content settasktext">{{"名称"}}
           <span class='icon icon-pull-right' @click="toTaskExpreePage"></span>
        </div>
      </div>
     </v-panel>
     <v-panel v-show="taskName">
      <div slot="header" class="c-panel-header u-cross-center">
      <div class="settaskname">定时任务</div>
    </div>
    <div slot="body"  class="c-panel-body u-without-padding">
     <v-modes style="color:#aaa;" v-model="grid_active" ref="mode"
     :numberal="2"  :items="grid_data"></v-modes>
   </div>
    </v-panel>
    <v-panel>
      <div slot="body" class="c-panel-body row-1 u-cross-center" >
        <div class="settaskname">执行结果通知</div>
        <div class="c-timer-content settasktext" >{{pmg_text}}
         <span class='icon icon-pull-right' @click="toPmgPage"></span>
        </div>
      </div>
    </v-panel>
    <div style="margin-top:10px;" v-show="deletShow">
     <v-button  class="row-2 task_deletes" @click.native="deleteTaskTankuang">删除定时</v-button>
    </div>
    </section>
    <!--重复-->
    <section id="page3" style="display:none;">
      <v-panel >
        <div slot="header" class="c-panel-header row-1 u-cross-center">重复<v-switch    ref="dsSwitch"
         :hold="true" v-model="switch_state"  @change="oneMore"
         ></v-switch></div>
         <div v-show="switch_state" slot="body" class="c-panel-body  row-5 u-cross-center">
           <v-dayspicker ref="dayspicker"  v-model="dayspicker_list">
           </v-dayspicker>
         </div>
      </v-panel>
      <v-panel v-show="!switch_state" style="margin-top:0px;">
        <div slot="header" v-show="true" class="c-panel-header row-1 u-cross-center">执行一次</div>
      </v-panel>
    </section>
    <!--定时指令设置 可根据设置显示是否显示页面根据需求完成-->
    <section id="page4" style="display:none;">
     <div>page4</div>
    </section>
    <!--执行结果-->
    <section id="page5" style="display:none;">
       <v-panel>
        <div slot="body" style="text-align:left">
          <v-checkboard v-model="checked_value">
          <div slot="item" @click="doTypePmg" data-value="1">均通知</div>
          <div slot="item" @click="doTypePmg" data-value="0">仅执行失败通知</div>
          <div slot="item" @click="doTypePmg" data-value="-1">不通知</div>
          </v-checkboard>
        </div>
      </v-panel>
    </section>
    <!--执行记录-->
    <section id="page6" style="display:none;">
      <div  style="margin-top:60%;" v-show="result_no">暂无执行记录！</div>
      <div  v-show="!result_no">
      <v-panel v-for="(log, index) in logListss" :key="index">
        <div slot="header" class="c-panel-header ">
            <div class="c-panel-title task_name">{{log.name}}</div>
            <div class="c-panel-extra">
              <span class='imgs_clo' @click="deleteOnelog(log)"></span>
            </div>
        </div>
        <div slot="body" class="c-panel-body u-cross-center ">
          <div class="row-2" style="position:relative; ">
            <div class="logtime">{{log.time}} <span style="font-size:0.12rem;">{{log.date}}</span></div>
            <div style="font-size:0.12rem; padding-top:0.4rem;" :class="log.color"  >{{log.text}}</div>
          </div>
        </div>
      </v-panel>
     </div>
    </section>
  <div class="mask" v-show="show"></div>
  </div>
</template>
<script>
// 时间空间获取时间空间
function getArrayTimes(num) {
  const times = [];
  for (let i = 0; i < num; i += 1) {
    const numStr = i < 10 ? `0${i}` : `${i}`;
    times.push(numStr);
  }
  return times;
}
// 获取当前时
function getNowTime() {
  const now = new Date();
  const curHour = now.getHours();
  const curMinu = now.getMinutes();
  const activeHous = curHour < 10 ? `0${curHour}` : `${curHour}`;
  const activeMinu = curMinu < 10 ? `0${curMinu}` : `${curMinu}`;
  const nowArr = [activeHous, activeMinu];
  return nowArr;
}
const hourAry = getArrayTimes(24);
const minuAry = getArrayTimes(60);
const activeHous = getNowTime()[0];
const activeMinu = getNowTime()[1];

export default {
  name: 'app',
  data() {
    return {
      timerSet: null,
      show: false,
      feedid: '',
      taskno: true,
      taskName: true,
      deletShow: false, // 删除定时按钮是否显示
      showAction: false, // 控制编辑弹框
      editigId: 0, // 编辑中的任务id 只用于修改 删除
      newTimeValue: '', // 获取新的时间
      switch_state: false, // 控制重复选择
      isAddOrUpdate: 'add',
      checked_value: '1',
      result_no: true,
      dayspicker_list: [1, 2, 3, 4, 5, 6, 7], // 重复日期
      timed_task: {
        app_time: '',
        task_name: '定时开机',
        task_time_express: '_*_*_*_*', // 定时类型
        task_express: [],
        task_type: 1,
        pmg_setting: 1,
      },
      task_type_text: '执行一次',
      grid_active: 1,
      grid_data: [{
        text: '定时开机',
        id: 1,
      }, {
        text: '定时关机',
        id: 0,
      }],
      pmg_text: '均通知',
      items_for_inline: [{
        values: hourAry.slice(),
        displayValues: hourAry.slice(),
        active: hourAry.indexOf(activeHous),
        unit: '时',
      }, {
        values: minuAry.slice(),
        displayValues: minuAry.slice(),
        active: minuAry.indexOf(activeMinu),
        unit: '分',
      }],
      items: [{
        text: '编辑',
      }, {
        text: '删除',
        color: 'red',
      }],
      tasksLst: [{ task_id: '1', name: '定时开启', color: 'clorin', time: '19:30', date: '周一 二 三 四 五 六 日  23小时59分后执行', isTrue: true, Expired: false },
      { task_id: '2', name: '定时关闭', color: 'clorout', time: '19:30', date: '周一 二 三 四 五 六 日', isTrue: true, Expired: true },
      { task_id: '3', name: '定时关闭', color: 'clorin', time: '19:30', date: '周一 二 三 四 五 六 日', isTrue: false, Expired: false }],
      logListss: [{ name: '定时开机', time: '19:40', date: '08月29日', text: '执行成功', color: 'clorout' },
      { name: '定时开机', time: '19:40', date: '08月29日', text: '执行失败  设备不在线', color: 'clorofierd' }],
    };
  },
  mounted() {
    window.JDSMART.ready(() => {
      this.init();
      this.taskfirstBar();
    });
    this.$refs.mode.$on('change', (state) => { // 修改定时任务及名称
      this.timed_task.task_name = state === 0 ? '定时关机' : '定时开机';
      this.timed_task.task_express[0].stream[0].stream_value = state;
    });
    this.$refs.dayspicker.$on('change', (value) => {
      const arrs = window.SmartSDK.getTextAndEps(value);
      this.timed_task.task_time_express = arrs[0];
      this.task_type_text = arrs[1];
    });
  },
  methods: {
    init() { // 判断在线状态 获取定时任务
      window.SmartSDK.initDevice((json) => {
        // 解析在线状态
        const devices = json.device;
        const state = devices.status;
        this.feedid = devices.feed_id;
        this.isOnlineState(state);
        this.getAllTasks();
        if (this.timerSet !== null) {
          clearInterval(this.timerSet);
          this.timerSet = null;
        }
        this.timerSet = setInterval(() => {
          this.getAllTasks();
        }, 4000);
      });
    },
    isOnlineState(data) { // 判断是否在线
      if (window.parseInt(data) === 1) {
        this.show = false;
        window.SmartSDK.isOnlines(false);
      } else {
        this.show = true;
        window.SmartSDK.isOnlines(true);
      }
    },
    getAllTasks() {
      const feedIds = { feed_ids: `[${this.feedid}]` };
      window.SmartSDK.getTasksList(feedIds, (json) => {
        if (json.length > 0) {
          this.taskno = false;
          this.tasksLst = [];
          this.parseTaskList(json);
        } else {
          this.tasksLst = [];
          this.taskno = true;
        }
      });
    },
    getLogLists() {
      const params = {
        feed_id: this.feedid,
        start_time: window.SmartSDK.GetDateStr(-7)[1],
        end_time: window.SmartSDK.GetDateStr(7)[1],
      };
      window.SmartSDK.getTaskTimingLog(params, (json) => {
        let obj = json.result;
        if (obj.length > 0) {
          this.result_no = false;
          this.logListss = [];
          obj = window.SmartSDK.getArrayafter(obj);
          for (let i = 0; i < obj.length; i += 1) {
            const objLogs = {};
            const arrChd = obj[i];
            objLogs.name = arrChd.task_name;
            objLogs.date_time = arrChd.excute_time;
            objLogs.time = arrChd.excute_time.substring(11, 16);
            objLogs.date = `${arrChd.excute_time.substring(5, 7)}月${arrChd.excute_time.substring(8, 10)}日`;
            if (window.parseInt(arrChd.result) === 1) {
              objLogs.text = '执行成功';
              objLogs.color = 'clorout';
            } else {
              objLogs.text = '执行失败  设备不在线';
              objLogs.color = 'clorofierd';
            }
            this.logListss.push(objLogs);
          }
        } else {
          this.result_no = true;
          this.logListss = [];
        }
      },
      (err) => {
        this.result_no = true;
        this.logListss = [];
        window.SmartSDK.toast('获取执行失败!');
        window.console.log(err);
      });
    },
    parseTaskList(data) {
      for (let i = 0; i < data.length; i += 1) {
        const list = data[i];
        const objTask = {};
        objTask.isTrue = (window.parseInt(list.task_status) === 1);
        objTask.name = list.task_name;
        objTask.task_id = list.task_id;
        objTask.color = 'clorin';
        // 解析日期
        const nextText = window.SmartSDK.getAfterTime(list.next_left_minutes,
        list.task_time_express);
        const taskTimes = window.SmartSDK.getDateAndTimes(list.task_time_express);
        objTask.time = `${taskTimes[0]}:${taskTimes[1]}`;
        objTask.date = `${taskTimes[2]} ${nextText.text}`;
        objTask.Expired = nextText.show;
        objTask.color = nextText.color;
        this.tasksLst.push(objTask);
      }
    },
    getLogList() {
      window.SmartSDK.titleBar('one', 'drawable_back', '清空', 'goBackTosk', 'clearLog', '执行结果记录');
      window.goBackTosk = () => {
        this.getAllTasks();
        window.SmartSDK.pageShow(1);
        window.SmartSDK.titleBar('one', 'drawable_back', 'drawable_add', 'toBackHtml', 'addTask', '定时设置');
      };
      window.clearLog = () => {
        this.logtanKuang();
      };
      this.getLogLists();
      window.SmartSDK.pageShow(6);
    },
    diffObject(obj) {
      const self = this;
      if (self.pevDate === '') {
        self.pevDate = obj;
        self.renderHtml(obj);
        self.logs = 'nihasdofsd不相同';
      } else {
        try {
          const arrDate = window.SmartSDK.diffForObject(self.pevDate, obj);
          if (arrDate[0]) {
            self.pevDate = obj;
          } else {
            //
          }
        } catch (e) {
          window.SmartSDK.toast('快照解析异常');
        }
      }
    },
    tshowAction(index) { // 显示编辑选择
      if (!this.showAction) {
        window.console.log(index);
        this.showAction = true;
        this.editigId = this.tasksLst[index].task_id;
        window.SmartSDK.titleBar('thr', '', '', '', '', '');
      }
    },
    updateInfo(val) {
      if (val === 0) {
        window.console.log('点击编辑');
        this.updateTaskOne();
      } else if (val === 1) {
        window.console.log('点击删除');
        this.deleteOneTask('out');
      } else {
        window.SmartSDK.titleBar('one', 'drawable_back', 'drawable_add', 'toBackHtml', 'addTask', '定时设置');
      }
    },
    deleteTaskTankuang() {
      window.SmartSDK.titleBar('thr', '', '', '', '', '');
      this.$confirm.show({
        title: '是否删除该定时任务',
        desc: '',
      }).then(() => {
        this.deleteOneTask('in');
      }).catch(() => {
        window.SmartSDK.titleBar('one', '取消', '保存', 'taskFirst', 'saveTask', '');
        this.$confirm.hide();
      });
    },
    logtanKuang() {
      window.SmartSDK.titleBar('thr', '', '', '', '', '');
      this.$confirm.show({
        title: '是否清空执行记录',
        desc: '',
      }).then(() => {
        this.clearAllLogs();
      }).catch(() => {
        window.SmartSDK.titleBar('one', 'drawable_back', '清空', 'goBackTosk', 'clearLog', '执行结果记录');
        this.$confirm.hide();
      });
    },
    clearAllLogs() {
      const params = { feed_id: this.feedid };
      window.SmartSDK.clearTaskTimingLog(params, (json) => {
        window.console.log(json);
        window.SmartSDK.toast('清空成功');
        this.getLogLists();
        window.SmartSDK.titleBar('one', 'drawable_back', '清空', 'goBackTosk', 'clearLog', '执行结果记录');
        this.$confirm.hide();
      },
      (err) => {
        window.SmartSDK.toast('操作失败');
        window.console.log(err);
      });
    },
    deleteOnelog(data) {
      const cmd = { feed_id: this.feedid,
        excute_times: [{ excute_time: data.date_time.substring(0, 16), stream_id: 'power' }] };
      window.SmartSDK.deleteTaskTimingLog(cmd, (json) => {
        window.SmartSDK.toast('删除成功');
        this.getLogLists();
        window.console.log(json);
      }, (err) => {
        window.SmartSDK.toast('操作失败');
        window.console.log(err);
      });
    },
    deleteOneTask(type) {
      const commnd = { task_ids: `[${this.editigId}]` };
      window.SmartSDK.deleteTaskTiming(commnd, (json) => {
        window.console.log(json);
        this.getAllTasks();
        window.SmartSDK.toast('删除成功!');
        window.SmartSDK.titleBar('one', 'drawable_back', 'drawable_add', 'toBackHtml', 'addTask', '定时设置');
        if (type === 'in') {
          this.$confirm.hide();
          window.SmartSDK.pageShow(1);
        }
      },
      (err) => {
        window.console.log(err);
        window.SmartSDK.toast('删除失败!');
        if (type === 'out') {
          window.SmartSDK.titleBar('one', 'drawable_back', 'drawable_add', 'toBackHtml', 'addTask', '定时设置');
        } else {
          window.SmartSDK.titleBar('one', '取消', '保存', 'taskFirst', 'saveTask', '');
        }
      });
    },
    doit(index) { // 启用停用定时
      const switchItem = this.$refs.asyncSwitch[index];
      const value = switchItem.value;
      const ids = this.tasksLst[index].task_id;
      const obj = value ? { task_ids: `[${ids}]`, control: 0 } : { task_ids: `[${ids}]`, control: 1 };
      window.SmartSDK.enOrDisTiming(obj, (json) => {
        window.console.log(json);
        this.tasksLst[index].isTrue = !value;
        switchItem.update(!value);
      });
    },
    updateTime(val) {
      this.newTimeValue = [val.active[0], val.active[1]];
    },
    oneMore(val) {
      window.console.log(val);
      this.switch_state = val;
      if (!val) {
        this.timed_task.task_time_express = window.SmartSDK.getTasksType();
        this.task_type_text = '执行一次';
      }
    },
    doTypePmg() {
      const numbers = window.parseInt(this.checked_value);
      if (numbers === 1) {
        // 均通知
        this.timed_task.pmg_setting = 1;
        this.pmg_text = '均通知';
      } else if (numbers === 0) {
        // 仅失败通知
        this.pmg_text = '仅执行失败通知';
        this.timed_task.pmg_setting = 0;
      } else if (numbers === -1) {
        // 不通知
        this.pmg_text = '不通知';
        this.timed_task.pmg_setting = -1;
      }
    },
    taskfirstBar() {
      window.SmartSDK.pageShow(1);
      window.SmartSDK.titleBar('one', 'drawable_back', 'drawable_add', 'toBackHtml', 'addTask', '定时设置');
      window.toBackHtml = () => {
        if (this.timerSet !== null) {
          clearInterval(this.timerSet);
          this.timerSet = null;
        }
        window.SmartSDK.urlToBack();
      };
      window.addTask = this.addTaskOne;
      window.goBackTask = this.toSavePage;
    },
    // 重复跳转
    toRepeatPage() {
      window.SmartSDK.pageShow(3);
      window.SmartSDK.titleBar('two', 'drawable_back', '', 'goBackTask', '', '重复');
    },
    // 跳转到定时指令 多任务时使用
    toTaskExpreePage() {
      window.SmartSDK.pageShow(4);
      window.SmartSDK.titleBar('two', 'drawable_back', '', 'goBackTask', '', '定时任务');
    },
    // 跳转通知页面
    toPmgPage() {
      window.SmartSDK.pageShow(5);
      window.SmartSDK.titleBar('two', 'drawable_back', '', 'goBackTask', '', '执行结果通知');
    },
    // 返回保存页面
    toSavePage() {
      window.SmartSDK.pageShow(2);
      const title = this.isAddOrUpdate === 'add' ? '新建定时' : '修改定时';
      window.SmartSDK.titleBar('one', '取消', '保存', 'taskFirst', 'saveTask', title);
    },
    addTaskOne() {
      window.SmartSDK.pageShow(2);
      this.deletShow = false;
      window.SmartSDK.titleBar('one', '取消', '保存', 'taskFirst', 'saveTask', '新建定时');
      window.taskFirst = this.taskfirstBar;
      window.saveTask = this.saveTaskTiming;
      this.initTaskTiming();
    },
    addTaskSave() {
      const newDotype = window.SmartSDK.get_expreee(`${this.newTimeValue[1]}_${this.newTimeValue[0]}${this.timed_task.task_time_express}`);
      if (newDotype.type === 1) {
        if (window.SmartSDK.timeIsBig(this.newTimeValue)) {
          const mingt = window.SmartSDK.GetDateStr(1)[0];
          this.timed_task.task_time_express = `_${mingt.getDate()}_${(mingt.getMonth() + 1)}_*_${mingt.getFullYear()}`;
        }
      }
      this.timed_task.app_time = window.SmartSDK.getFormatedTime();
      this.timed_task.task_time_express = `${this.newTimeValue[1]}_${this.newTimeValue[0]}${this.timed_task.task_time_express}`;
      const params = { timed_task: JSON.stringify(this.timed_task) };
      window.SmartSDK.addTaskTiming(params,
      (json) => {
        if (window.parseInt(json.result.task_id) === 0) {
          window.SmartSDK.toast('咦！您设置的定时任务与之前的定时任务有冲突，请您重新设置哦！');
        } else {
          window.SmartSDK.toast('保存成功');
          this.taskfirstBar();
          this.getAllTasks();
          window.SmartSDK.serTimeBig(json.result.server_time);
        }
      },
      (err) => {
        window.console.log(err);
        window.SmartSDK.toast('保存失败,定时已存在或网络异常');
      });
    },
    updateTaskOne() {
      const params = { task_ids: `[${this.editigId}]` };
      window.SmartSDK.getTimgByID(params, (json) => {
        window.SmartSDK.pageShow(2);
        this.deletShow = true;
        window.SmartSDK.titleBar('one', '取消', '保存', 'taskFirst', 'saveTask', '修改定时');
        this.isAddOrUpdate = 'update';
        window.taskFirst = this.taskfirstBar;
        window.saveTask = this.saveTaskTiming;
        this.getTaskTimingbyId(json);
      },
      (err) => {
        window.console.log(err);
        window.SmartSDK.toast('操作失败!');
      });
      //
    },
    updateTaskSave() {
      const newDotype = window.SmartSDK.get_expreee(`${this.newTimeValue[1]}_${this.newTimeValue[0]}${this.timed_task.task_time_express}`);
      if (newDotype.type === 1) {
        if (window.SmartSDK.timeIsBig(this.newTimeValue)) {
          const mingt = window.SmartSDK.GetDateStr(1)[0];
          this.timed_task.task_time_express = `_${mingt.getDate()}_${(mingt.getMonth() + 1)}_*_${mingt.getFullYear()}`;
        } else {
          const mingt = window.SmartSDK.GetDateStr(0)[0];
          this.timed_task.task_time_express = `_${mingt.getDate()}_${(mingt.getMonth() + 1)}_*_${mingt.getFullYear()}`;
        }
      }
      this.timed_task.task_id = this.editigId;
      this.timed_task.app_time = window.SmartSDK.getFormatedTime();
      this.timed_task.task_time_express = `${this.newTimeValue[1]}_${this.newTimeValue[0]}${this.timed_task.task_time_express}`;
      const params = { timed_task: JSON.stringify(this.timed_task) };
      window.SmartSDK.updataTaskTiming(params,
      (json) => {
        window.SmartSDK.toast(JSON.stringify(json));
        if (window.parseInt(json.result.task_id) === 0) {
          window.SmartSDK.toast('咦！您设置的定时任务与之前的定时任务有冲突，请您重新设置哦！');
        } else {
          window.SmartSDK.toast('保存成功');
          this.taskfirstBar();
          this.getAllTasks();
          window.SmartSDK.serTimeBig(json.result.server_time);
        }
      },
      (err) => {
        window.console.log(err);
        window.SmartSDK.toast('保存失败,定时已存在或网络异常');
      });
    },
    saveTaskTiming() {
      if (this.isAddOrUpdate === 'add') {
        this.addTaskSave();
      } else {
        this.updateTaskSave();
      }
    },
    initTaskTiming() {
      const Hous = getNowTime()[0];
      const Minu = getNowTime()[1];
      this.items_for_inline = [{
        values: hourAry.slice(),
        displayValues: hourAry.slice(),
        active: hourAry.indexOf(Hous),
        unit: '时',
      }, {
        values: minuAry.slice(),
        displayValues: minuAry.slice(),
        active: minuAry.indexOf(Minu),
        unit: '分',
      }];
      this.timed_task.task_time_express = window.SmartSDK.getTasksType();
      this.switch_state = false;
      this.task_type_text = '执行一次';
      this.grid_active = 1;
      this.timed_task.task_express = [{ feed_id: this.feedid,
        stream: [{ stream_id: 'power', stream_value: 1 }] }];
      this.timed_task.task_name = '定时开机';
      this.timed_task.pmg_setting = 1;
      this.pmg_text = '均通知';
      this.dayspicker_list = [];
      this.isAddOrUpdate = 'add';
      this.checked_value = '1';
    },
    getTaskTimingbyId(data) {
      const obj = data.result[0];
      const typeArr = window.SmartSDK.getDateAndTimes(obj.task_time_express);
      if (typeArr[4] === 1) {
        this.switch_state = false;
        this.dayspicker_list = [];
      } else {
        this.switch_state = true;
        this.dayspicker_list = typeArr[5].split(',');
        if (typeArr[4] === 4) {
          this.dayspicker_list = [1, 2, 3, 4, 5, 6, 7];
        }
      }
      this.task_type_text = typeArr[2];
      this.items_for_inline = [{
        values: hourAry.slice(),
        displayValues: hourAry.slice(),
        active: hourAry.indexOf(`${typeArr[0]}`),
        unit: '时',
      }, {
        values: minuAry.slice(),
        displayValues: minuAry.slice(),
        active: minuAry.indexOf(`${typeArr[1]}`),
        unit: '分',
      }];
      const numbers = window.parseInt(obj.pmg_setting);
      if (numbers === -1) {
        this.pmg_text = '不通知';
        this.timed_task.pmg_setting = -1;
        this.checked_value = '-1';
      } else if (numbers === 0) {
        this.pmg_text = '仅执行失败通知';
        this.timed_task.pmg_setting = 0;
        this.checked_value = '0';
      } else if (numbers === 1) {
        this.pmg_text = '均通知';
        this.timed_task.pmg_setting = 1;
        this.checked_value = '1';
      }
      this.timed_task.task_name = obj.task_name;
      const taskDo = window.SmartSDK.passDate(obj.task_express[0].stream);
      this.timed_task.task_time_express = typeArr[3];
      this.timed_task.task_express = [{ feed_id: this.feedid,
        stream: [{ stream_id: 'power', stream_value: taskDo }] }];
      this.grid_active = taskDo;
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
