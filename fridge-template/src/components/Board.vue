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
    title: {
      type: String,
      default: '',
    },
    hasSwitch: {
      type: Boolean,
      default: false,
    },
    num: {
      type: [Number, String],
      default: NaN,
    },
    // 禁用开关
    disabled: {
      type: Boolean,
      default: false,
    },
    // 隐藏数字，显示关闭文案
    // 废弃！！！，由switchValue 控制
    close: {
      type: Boolean,
      default: null,
    },
    // 开关的值，true为开，false为关
    switchValue: {
      type: Boolean,
      default: null,
    },
    // 整数时是否显示小数点。 int 时 5, float 时 5.0
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
@import '../styles/variables.css';

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
    font-size: $min-font-size-xl;
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
