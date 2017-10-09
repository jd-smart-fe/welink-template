<template lang="html">
  <div :class="['mode-button', disabled ? 'disabled' : '']">
    <div :class="['button', iconCls]">
    </div>
    <div class="title">
      {{title}}
    </div>
  </div>
</template>

<script>
export default {
  name: 'mode-button',

  data() {
    return {};
  },

  props: {
    // 模式名称 
    title: {
      type: String,
      required: true,
    },
    // icon 的 CSS类名 
    iconCls: {
      type: String,
      required: true,
    },
    // 置该模式为禁止点击状态 
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="postcss">

.mode-button{
  &.disabled {
    pointer-events: none;
  }

  .button{
    width: .34rem;
    height: .34rem;
    border-radius: 50%;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: contain;
    margin: auto;
  }

  .title{
    margin-top: .08rem;
    font-size: .12rem;
    text-align: center;
    white-space: nowrap;

    @media screen and (max-width: 375px) {
      font-size: 12px;
    }
  }
}
</style>
