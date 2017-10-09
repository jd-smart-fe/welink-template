<template>
	<div
    :class="['c-switch', disabled ? 'is-disabled' : '',
      value ? 'is-on' : 'is-off',
      isAndroid_v4_2 ? 'c-switch-fix-bug' : '',
    ]"
    @click="handle">
		<span class="c-switch-button"></span>
	</div>
</template>

<script>
  export default {
    name: 'v-switch',

    data() {
      return {
        isAndroid_v4_2: false,
      };
    },

    props: {

      value: {
        type: Boolean,
        default: false,
      },

      disabled: {
        required: false,
        type: Boolean,
        default: false,
      },

      hold: {
        required: false,
        type: Boolean,
        default: false,
      },
    },

    created() {
      this.isAndroid_v4_2 = /Android 4\.2/.test(window.navigator.userAgent);
    },

    methods: {
      handle() {
        // state: disabled
        if (this.disabled) {
          return;
        }

        if (this.hold) {
          this.$emit('change', this.value);
          return;
        }

        const val = !this.value;
        this.$emit('input', val);
        this.$emit('change', val);
      },

      update(val) {
        if (val === 'toggle') {
          this.$emit('change', !this.value);
          this.$emit('input', !this.value);
          return;
        }

        this.$emit('change', val);
        this.$emit('input', val);
      },
    },
  };
</script>

<style lang="postcss">
  $box-width: 0.56rem;
  $box-height: 0.26rem;
  $box-background-color-off: #d5d5d5;
  $box-background-color-on: #f16a13;
  $box-background-color-disable: #ececec;

  $btn-width: .18rem;
  $btn-height: .18rem;
  $btn-background-color: #fff;

  $transform-x-off: .04rem;
  $transform-x-on: 0.34rem;

  /**
  *  Andriod 4.2.x 在有 border-radius 的情况下，background 溢出。
  */
  .c-switch-fix-bug {
    background-clip: padding-box;
  }

	.c-switch {

    position: relative;
		display: inline-block;
		width: $box-width;
		height: $box-height;

		border-radius: 50px;
    flex:none;

    background-color: $box-background-color-off;
    border-color: $box-background-color-off;

    transition-property: border-color, background-color, transform;
    transition-duration: .3s;
    transition-timing-function: ease;

		.c-switch-button {
			top: 0;
      bottom: 0;
	    left: 0;
      margin: auto 0;
      width: $btn-width;
      height: $btn-height;
      transform: translate3d($transform-x-off, 0, 0);

	    position: absolute;
	    border-radius: 100%;
      transition-property: border-color, transform;
      transition-duration: .3s;
      transition-timing-function: ease;
	    z-index: 2;
	    background-color: $btn-background-color;

      box-shadow: 0px 3px 6px rgba(100,100,100,.4);
      background: linear-gradient(to bottom, #fff 0%, #dedede 100%);
		}

    &.is-on {
      background-color: $box-background-color-on;
      border-color: $box-background-color-on;

      .c-switch-button {
        transform: translate3d($transform-x-on, 0, 0);
      }
    }

    &.is-disabled{
      /*background-color: $box-background-color-disable;
      border-color: $box-background-color-disable;*/
			opacity: .7;
    }
	}
</style>
