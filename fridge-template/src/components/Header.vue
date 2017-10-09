<template lang="html">
  <div class="header">
    <div>
      <span class="grey">{{ title1 }}</span><span :class="['num', close1 ? 'close' : '']">{{ close1 ? '关闭' : value1 }}</span><span v-show="!close1" class="unit">°C</span>
    </div>
    <div v-if="value2 !== null">
      <span class="grey">{{ title2 }}</span><span :class="['num', close2 ? 'close' : '']">{{ close2 ? '关闭' : value2 }}</span><span v-show="!close2" class="unit">°C</span>
    </div>
    <div v-if="value3 !== null">
      <span class="grey">{{ title3 }}</span><span :class="['num', close3 ? 'close' : '']">{{ close3 ? '关闭' : value3 }}</span><span v-show="!close3" class="unit">°C</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',

  data() {
    return {

    };
  },

  props: {
    // 冰箱室的名称
    title1: {
      type: String,
      required: true,
      default: '',
    },
    // 冰箱室的温度
    value1: {
      type: [Number, String],
      required: true,
      default: null,
    },
    // 冰箱室是否关闭
    close1: {
      type: Boolean,
      required: true,
      default: null,
    },

    title2: {
      type: String,
      default: '',
    },
    value2: {
      type: [Number, String],
      default: null,
    },
    close2: {
      type: Boolean,
      default: null,
    },

    title3: {
      type: String,
      default: '',
    },
    value3: {
      type: [Number, String],
      default: null,
    },
    close3: {
      type: Boolean,
      default: null,
    },
  },
};
</script>

<style lang="postcss">

.header{
  display: flex;
  height: .21rem;
  padding: .16rem 0;
  margin-bottom: .075rem;

  background: #fff;
  font-size: .13rem;
  line-height: .22rem;

  @media screen and (max-width: 375px) {
    font-size: 13px;
  }

  .grey{
    color: #666;
    margin-right: 2px;
  }

  .num {
    font-size: .15rem;

    @media screen and (max-width: 375px) {
      font-size: 15px;
    }

    &.close {
      font-size: .13rem;

      @media screen and (max-width: 375px) {
        font-size: 13px;
      }
    }

  }

  .unit {
    font-size: .12rem;

    @media screen and (max-width: 375px) {
      font-size: 12px;
    }
  }

  div{
    flex: 1;
    text-align: center;

    + div{
      border-left: 1px solid #eaeaea;
    }
  }
}
</style>
