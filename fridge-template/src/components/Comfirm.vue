<template lang="html">
  <div class="confirm">
    <div class="confirm-board">
      <div class="confirm-content">
        <div class="title">{{ title }}</div>
        <div class="content">{{ content }}</div>
      </div>
      <div class="confirm-button">
        <div class="cancel" @click='handleCancel'>取消</div>
        <div class="accept" @click='handleAccept'>确认</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'confirm',

  props: {
    // 弹窗标题
    title: {
      type: String,
      default: '',
    },
    // 弹窗内容
    content: {
      type: String,
      default: '',
    },
  },

  methods: {
    handleCancel() {
      this.$emit('cancel');
    },
    handleAccept() {
      this.$emit('accept');
    },
  },
};
</script>

<style lang="css">

.confirm{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.confirm-board{
  position: absolute;
  right: 0;
  left: 0;
  top: 50%;
  margin: auto;
  width: 2.8rem;
  transform: translateY(-50%);
  background: #fff;
  border-radius: .05rem;
  background-clip: padding-box;
}
.confirm-content{
  padding: .2rem;
  text-align: center;

  .title {
    font-size: .15rem;
    margin-bottom: .2rem;

    @media screen and (max-width: 375px) {
      font-size: 13px;
    }
  }

  .content{
    font-size: .12rem;
    line-height: .2rem;
    color: #666;

    @media screen and (max-width: 375px) {
      font-size: 12px;
    }
  }
}
.confirm-button{
  display: flex;
  font-size: .15rem;
  color: #f16a13;
  line-height: .4rem;
  border-top: 1px solid #e1e1e1;

  @media screen and (max-width: 375px) {
    font-size: 13px;
  }

  .cancel{
    flex: 1;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    position: relative;

    &:after{
      position: absolute;
      right: 0;
      top: 0;
      content: "";
      width: 1px;
      height: .4rem;
      background: #e1e1e1;
    }
  }

  .accept{
    flex: 1;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
  }
}
</style>
