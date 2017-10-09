<template>
  <div>
    <div :class="['debug-dot',show_msg?'debug-hide':'']" @click="dotClick">

    </div>
    <div v-show="show_msg" class="debug-box">
      <div class="debug-box-min" @click="minimize"></div>
      <pre class="debug-msg">
        {{formatJson(msg)}}
      </pre>

    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      show_msg: false,
    };
  },
  props: {
    msg: {
      type: String,
      default: '',
    },
  },
  methods: {
    dotClick() {
      this.show_msg = true;
    },
    minimize() {

      this.show_msg = false;
    },
    formatJson(json, options) {
      /* eslint-disable */
      let reg = null;
      let formatted = '';
      let pad = 0;
      let PADDING = '    ';
      options = options || {};

      options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;

      options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
      if (typeof json !== 'string') {
        json = JSON.stringify(json);
      } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
      }
      reg = /([\{\}])/g;
      json = json.replace(reg, '\r\n$1\r\n');
      reg = /([\[\]])/g;
      json = json.replace(reg, '\r\n$1\r\n');
      reg = /(\,)/g;
      json = json.replace(reg, '$1\r\n');
      reg = /(\r\n\r\n)/g;
      json = json.replace(reg, '\r\n');
      reg = /\r\n\,/g;
      json = json.replace(reg, ',');
      if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
      }
      if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
      }
      (json.split('\r\n')).forEach(function (node, index) {
          let i = 0,
          indent = 0,
          padding = '';

        if (node.match(/\{$/) || node.match(/\[$/)) {
          indent = 1;
        } else if (node.match(/\}/) || node.match(/\]/)) {
          if (pad !== 0) {
            pad -= 1;
          }
        } else {
          indent = 0;
        }

        for (i = 0; i < pad; i++) {
          padding += PADDING;
        }

        formatted += padding + node + '\r\n';
        pad += indent;
      }
      );
      return formatted;
    },
  },
};
</script>


<style>
.debug-dot {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #000;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  transition: all 0.2;
  z-index: 50;
}

.debug-hide {
  width: 0;
  height: 0;
}

.debug-box {
  position: fixed;
  width: 80%;
  height: 60vw;
  background-color: #ccc;
  border-radius: 6%;
  left: 50%;
  top: 50%;
  box-sizing: border-box;
  padding: 20px 5px 5px;

  transform: translate(-50%, -50%);
  z-index: 50;
  .debug-box-min {
    margin: 5px;
    position: absolute;
    content: '';
    width: 20px;
    height: 5px;
    background-color: #666;
    right: 5px;
    top: 5px;
    text-align: center;
  }
}

.debug-msg {
  width: 100%;
  height: 80%;
  overflow-y: auto;
}
</style>

