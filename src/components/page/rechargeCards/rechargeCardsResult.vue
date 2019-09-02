<template>
  <div id="rechargeCardsResult">
    <div class="icon">
      <img src="@/assets/success.png" v-if="state" alt="" />
      <img src="@/assets/warning.png" v-else alt="" />
    </div>
    <div style="padding-top:0.5rem">
      <p style="color:#08bb06;font-size:0.45rem" v-if="state">支付成功</p>
      <p style="color:#ff2d4b;font-size:0.45rem" v-else>
        支付异常，请稍候重新支付
      </p>
    </div>
    <div class="back-btn" @click="toBackIndex">返回首页</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      state: false // 支付状态
    };
  },
  created() {
    this.state = this.$route.query.state;
  },
  methods: {
    toBackIndex() {
      this.$router.replace("/index");
    }
  }
};
</script>

<style scoped>
#rechargeCardsResult {
  min-height: 100vh;
  background-color: #fff;
  text-align: center;
}
.icon {
  padding-top: 0.6rem;
  margin: 0 auto;
}
.icon > img {
  width: 1.5rem;
  height: 1.5rem;
}
.back-btn {
  margin: 30vh auto 0;
  width: 2rem;
  height: 0.8rem;
  font-size: 0.3rem;
  line-height: 0.8rem;
  text-align: center;
  border-radius: 0.1rem;
  border: 1px solid #999;
  color: #999;
}
</style>