<template lang="html">
  <v-actions-box :value="show">
    <div class="action">

      <div class="action-title">
        {{title}}
      </div>

      <div class="action-content">
        <div class="action-selects">
          <div
            v-for="(value, index) in list"
            :class="['action-option', index === activeIndex ? 'active' : '']"
            @click="activeIndex = index"
          >
            <span>{{ value }}</span>
            <span>{{ description }}</span>
          </div>
        </div>
        <div class="action-button">
          <div class="button" @click="handleEnsure">确定</div>
        </div>
      </div>
    </div>
  </v-actions-box>
</template>

<script>
export default {
  name: 'actions',

  data() {
    return {
      wrapperShow: false,
      slidein: false,
      activeIndex: 0,
    };
  },

  props: {
    title: {
      type: String,
      default: '',
    },
    list: {
      type: Array,
      default() {
        return [6, 12, 18, 24, 30];
      },
    },
    description: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    handleEnsure() {
      this.$emit('change', this.activeIndex);
    },
  },
};
</script>

<style lang="css">
.action {
  width: 100%;
  background: #fff;
}
.action-title {
  padding: .14rem;
  text-align: center;
  border-bottom: 1px solid #e1e1e1;
}
.action-selects {
  display: flex;
  padding: .15rem;
  margin-left: -.05rem;
}
.action-option {
  flex: 1;
  padding: .04rem .02rem;
  border: 1px solid #e1e1e1;
  border-radius: .02rem;
  margin-left: .05rem;
  display: flex;
  flex-direction: column;

  span {
    font-size: .2rem;
    color: #f37611;
    text-align: center;
    margin-bottom: .06rem;

    + span {
      font-size: .12rem;
      color: #aaa;
    }
  }

  &.active {
    border: 1px solid #f37611;
  }
}
.action-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: .05rem;
  padding-bottom: .2rem;

  .button {
    width: 1.2rem;
    height: .36rem;
    border-radius: .2rem;
    background: #f37611;
    text-align: center;
    line-height: .36rem;
    color: #fff;
  }
}
</style>
