<template>
  <div class="c-toast-wrapper">
    <div :class="['c-toast',
      icon && 'c-toast-withicon',
      shown ? 'c-toast-show' : 'c-toast-hide']">

      <span v-if="icon" :class="['c-toast-icon', `${icon}`,
        icon.indexOf('icon-') == 0 && 'icon']"></span>

      <span class="c-toast-text">{{text}}</span>
    </div>
  </div>
</template>

<script>
  // this.$toast.show({
  //   icon: 'icon-home',   // toast 的 icon，默认无
  //   text: '操作成功',      // 提示的文字，默认无
  //   duration: 2000        // toast 持续的时间，默认 2000
  //   autohide: true,       // 是否自动隐藏，默认 true
  // })


  const defaults = {
    autohide: true,
    shown: false,
    duration: 1500,
    icon: '',
  };

  export default {
    name: 'v-toast',
    type: 'singleton',

    data() {
      return {

        ...Object.assign({}, defaults),

        text: '',
        timer: null,
      };
    },

    created() {
      this.inited = false;
    },

    methods: {

      init() {

        document.body.appendChild(this.$el);
        this.inited = true;
      },

      config(cfg) {

        cfg = Object.assign({}, defaults, cfg);

        for (const prop in cfg) {
          if (Object.prototype.hasOwnProperty.call(cfg, prop)) {
            this[prop] = cfg[prop];
          }
        }
      },

      destroy() {
        document.body.removeChild(this.$el);
        this.inited = false;
      },

      show(opt) {

        if (!this.inited) {
          this.init();
        }

        if (typeof opt === 'string') {
          opt = {
            text: opt,
          };
        }
        clearTimeout(this.timer);
        this.config(opt);
        this.shown = true;

        if (!this.autohide) {
          return;
        }
        this.timer = setTimeout(() => {
          this.hide();
        }, this.duration);
      },
      hide() {
        this.shown = false;
      },
    },
  };
</script>

<style lang="postcss">

  $l-radius: 3px;
  $prefix: .c-toast;

  .c-toast-wrapper {
    position: fixed;
    bottom: 10%;
    left: 50%;
    width: 80%;
    transform: translateX(-50%);
    text-align: center;
    z-index:200;
  }

  $prefix {
    display: inline-block;

    margin: auto;
    padding: 12px 16px;

    text-align:center;
    font-size: inherit;
    vertical-align: middle;

    background: rgba(0, 0, 0, 0.8);
    border-radius: $l-radius;

    &.c-toast-withicon {
      width: 100px;
      height: 100px;
      padding: .1px 0 0 0;

      /* position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto; */

      border-radius: $l-radius;

      .c-toast-text {
        margin-bottom: 12px;
        height: 30px;
        line-height: 30px;
      }
    }

    &.c-toast-hide {
      display: none;
    }

    &.c-toast-show {
      /*display: block;*/
    }
  }

  .c-toast-icon {
    display: block;
    color: white;
    margin-top: 20px;
    font-size: 30px;
    margin-bottom: 5px;
  }

  .c-toast-text {
    color: white;
    display: inline-block;
    box-sizing: border-box;

    max-width: 100%;
    width: auto;
  }

</style>
