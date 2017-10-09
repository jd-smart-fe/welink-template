<template lang="html">
  <span>
    <i :class="numSymbol">
    </i><i :class="numTens">
    </i><i :class="numSingle">
    </i><i :class="numPoint">
    </i><i :class="numMin">
    </i><i :class="numDegree">
    </i>
  </span>
</template>

<script>
  export default {
    name: 'number',

    data() {
      return {

      };
    },

    props: {
      num: {
        type: [Number, String],
        default: NaN,
      },

      accur: {
        type: String,
        required: false,
        default: 'int',    // float int
      },
    },

    computed: {
      formNum() {
        if (!isNaN(this.num)) {
          return Math.abs(this.num * 10).toString().split('');
        }
        return [];
      },

      numSymbol() {
        let cls = '';
        if (this.num < 0) {
          cls = 'icon-symbol';
        }
        return cls;
      },

      numTens() {
        let cls = '';

        if (this.formNum.length === 3) {
          cls = `icon-${this.formNum[0]}`;
        }

        return cls;
      },

      numSingle() {
        let cls = '';

        if (this.formNum.length > 1) {
          cls = `icon-${this.formNum[this.formNum.length - 2]}`;
        } else if (this.formNum.length === 1) {
          cls = 'icon-0';
        }

        return cls;
      },

      numPoint() {
        const length = this.formNum.length;
        let cls = '';

        if (this.accur === 'float' && length > 0) {
          cls = 'icon-point';

        } else if (length > 0 && this.formNum[length - 1] !== '0') {
          cls = 'icon-point';
        }

        return cls;
      },

      numMin() {
        const length = this.formNum.length;
        let cls = '';

        // 整数显示小数点
        if (this.accur === 'float' && length > 0) {
          cls = `icon-${this.formNum[length - 1]}`;

        } else if (length > 0 && this.formNum[length - 1] !== '0') {
          cls = `icon-${this.formNum[length - 1]}`;
        }


        return cls;
      },

      numDegree() {
        return isNaN(this.num) ? '' : 'icon-degree';
      },
    },
  };
</script>
