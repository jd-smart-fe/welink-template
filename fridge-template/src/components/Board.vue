<template lang="html">
  <div class="board">
    <div class="board-top">
      <div class="board-title">
        {{title}}
      </div>
      <div v-show="!switchValue && switchValue !== null" class="board-close">
        关闭
      </div>
      <div v-show="switchValue === null || switchValue" class="board-num">
        <number :num="num" :accur="accur"></number>
      </div>
      <div v-if="hasSwitch" class="board-switch">
        <switchCom
          v-model="switchValue"
          :disabled="disabled"
          :hold='true'
          @change="handleSwitch"
        />
      </div>
    </div>
    <div class="board-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import switchCom from './Switch';
import number from './Number';

export default {
  name: 'board',

  components: {
    switchCom,
    number,
  },

  data() {
    return {
    };
  },

  props: {
    // 面板标题
    title: {
      type: String,
      default: '',
    },
    // 是否需要开关按钮
    hasSwitch: {
      type: Boolean,
      default: false,
    },
    // 显示的温度数字
    num: {
      type: [Number, String],
      default: NaN,
    },
    // 开关置为禁用状态
    disabled: {
      type: Boolean,
      default: false,
    },
    // 开关状态，true为开，false为关
    switchValue: {
      type: Boolean,
      default: null,
    },
    // 数字显示模式。 例如当 num === 5 时：取值 int 时显示 5, float 时显示 5.0
    accur: {
      type: String,
      required: false,
      default: 'int',    // float int
    },
  },

  methods: {
    handleSwitch(val) {
      this.$emit('changeSwitch', val);
    },
  },
};
</script>

<style lang="postcss">
.board{
  margin: .15rem;
  margin-top: .075rem;
  background: #fff;
}
.board-top{
  height: .27rem;
  padding: .075rem .15rem;
  border-bottom: 1px solid #eaeaea;
  font-size: .14rem;
  line-height:.27rem;

  @media screen and (max-width: 375px) {
    font-size: 13px;
  }

  > div{
    float: left;
  }

  .board-switch{
    float: right;
    height: .3rem;
  }
}
.board-content{
  height: 1rem;
}

.board-close{
  color: #666;
  margin-left: .2rem;
}
.board-num{
  margin-left: .18rem;
  font-size: .2rem;
  margin-top: 2px;

  i{
    color: #f16a13;
  }
}
</style>
