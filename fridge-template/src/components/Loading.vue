<template lang="html">
  <div class="loading" v-show="value">
    <i></i>
  </div>
</template>

<script>
  export default {
    name: 'loading',
    data() {
      return {
        timer: null,
      };
    },
    props: {
      value: {
        type: Boolean,
        defualt: true,
      },
    },
    watch: {
      value(val) {
        if (val) {
          clearTimeout(this.timer);
          this.timer = setTimeout(() => {
            this.$emit('input', !val);
          }, 8000);
        }
      },
    },
  };
</script>

<style lang="postcss">
  .loading {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 100;

    width: 100%;
    height: 100%;

    > i {
      position: fixed;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;

      display: block;
      width: .8rem;
      height: .8rem;

      opacity: .8;

      background: url(../assets/img/loading.png) center center;
      background-size: contain;

      animation: loading 1s linear infinite;
    }
  }

  @keyframes loading {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
