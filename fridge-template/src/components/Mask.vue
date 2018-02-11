<template>
  <div class="mask" v-show="show"></div>
</template>

<script>
export default {
  name: 'masks',
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="postcss">
  .mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 150;
    background: #000;
    opacity: 0.7;
  }
</style>
