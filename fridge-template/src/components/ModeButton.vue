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
    title: {
      type: String,
      required: true,
    },

    iconCls: {
      type: String,
      required: true,
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="postcss">
@import '../styles/variables.css';

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
      font-size: $min-font-size;
    }
  }
}
</style>
