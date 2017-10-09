<template lang="html">
  <div class="rbox">
    <div class="rbox-begin">
      <div class="rbox-icon"></div>
      <div class="rbox-num">
        {{ displayMin || min }}°C
      </div>
    </div>
    <div class="rbox-content">
      <div v-if="middle !== -99" class="rbox-freeze">

        <div :class="['rbox-freeze-line', disabled ? 'disabled': '',minCold && 'rbox-min']">
          <span v-show="minCold" class="c-range-slider-button rbox-slider-button"></span>
          <span class="rbox-24">{{middle}}°C</span>
        </div>
      </div>
      <range ref="range"
        :min="realMin"
        :max="realMax" class="rbox-range"
        :disabled="disabled"
        :disappear="minCold"
        v-model="insideValue"
      />
    </div>
    <div class="rbox-end">
      <div class="rbox-icon"></div>
      <div class="rbox-num">
        {{ displayMax || max }}°C
      </div>
    </div>
  </div>
</template>

<script>
import Range from './Range';

export default {
  name: 'RangeBox',

  data() {
    return {
      insideValue: null,
    };
  },

  props: {
    // 专为美菱冰箱设计 滑杆最左侧显示的温度
    displayMin: {
      type: [Number, String],
      default: null,
    },
    // 专为美菱冰箱设计 滑杆最右侧显示的温度
    displayMax: {
      type: [Number, String],
      default: null,
    },
    // 专为美菱冰箱设计
    middle: {
      type: [Number, String],
      default: -99,
    },
    // 专为美菱冰箱设计 温度跳跃到最小值
    minCold: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 实际调节可调节的温度最小值
    min: {
      type: [Number, String],
      default: -24,
    },
    // 实际调节可调节的温度最大值
    max: {
      type: [Number, String],
      default: 18,
    },
    // 当前的温度值
    val: {
      type: [Number, String],
      default: 0,
    },
    // 是否禁用滑动条
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
    // 滑动步距为 0.1
    accur: {
      type: String,
      required: false,
      default: 'int',    // float int
    },
  },

  computed: {
    realMin() {
      return this.accur === 'float'
        ? this.min * 10
        : this.min;
    },

    realMax() {
      return this.accur === 'float'
        ? this.max * 10
        : this.max;
    },
  },

  components: {
    Range,
  },

  watch: {
    val(value) {
      if (this.minCold === true) return;
      this.insideValue = this.accur === 'float'
        ? value * 10
        : value;
    },

    insideValue(val) {
      const realValue = this.accur === 'float'
        ? val / 10
        : val;

      if (this.accur === 'float' && val % 10 === 0) {
        this.$emit('sliding', `${realValue}.0`);
      } else {
        this.$emit('sliding', realValue);
      }
    },
  },

  created() {
    this.insideValue = this.accur === 'float'
      ? this.val * 10
      : this.val;
  },

  mounted() {
    this.$refs.range.$on('change', val => {
      const realValue = this.accur === 'float'
        ? val / 10
        : val;

      if (this.accur === 'float' && val % 10 === 0) {
        this.$emit('change', `${realValue}.0`);

      } else {
        this.$emit('change', realValue);
      }
    });
  },
};
</script>

<style  lang="postcss">
@import '../styles/variables.css';

.rbox {
  display: flex;
  height: 100%;
  width: 3.25rem;
  margin: 0 .1rem;
  display: -webkit-inline-box;

  .rbox-slider-button {
    left: -0.14rem;
  }
}

.rbox-begin,
.rbox-end {
  flex: none;
  width: .28rem;
  margin: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.rbox-icon {
  width: .20rem;
  height: .20rem;
  background: url('../assets/img/thermometer.png')no-repeat center center;
  background-size: contain;
}

.rbox-num {
  margin-top: .07rem;
  white-space: nowrap;
  position: relative;
  font-size: .12rem;
  color: #999;

  @media screen and (max-width: 375px) {
    font-size: $min-font-size;
  }
}

.rbox-content {
  display: flex;
  width: 2.2rem;
  align-items: center;
  padding: .1rem;
}

.rbox-range {
  /*flex: 2;*/
}

.rbox-freeze {
  /*flex: 1;*/
  display: block;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  width: .73rem;
}


.rbox-freeze-line {
  width: 100%;
  height: 0.02rem;
  box-sizing: border-box;
  border-top-left-radius: .01rem;
  border-bottom-left-radius: .01rem;
  background: #eee;
  position: relative;
  &.rbox-min {
    &:after {
      background-color: #eee;
    }
  }
  .rbox-24 {
    display: block;
    position: absolute;
    right: -.14rem;
    top: .18rem;
    font-size: .14rem;

    @media screen and (max-width: 375px) {
      font-size: $min-font-size;
    }
  }

  &:after {
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: .02rem;
    height: .1rem;
    background: #f16a13;
  }
  &.disabled {
    &:after {
      background: #eee;
    }
  }
}
/*.board:nth-last-child(1) .rbox-range{
  width: 1.45rem;
}*/
</style>
