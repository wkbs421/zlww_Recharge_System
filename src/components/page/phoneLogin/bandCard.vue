<template>
    <div style="color: #333;">
      <yd-cell-item>
            <div slot="left">
                <span class="left-text">绑定信息：</span>
            </div>
        </yd-cell-item>
        <ul>
          <li class="first-tittle">1. 请确保您的智能设备支持中国联通的4G/3G网络</li>
          <li class="second-tittle">2. 一旦流量卡插入设备，则不允许更换设备或卡槽</li>
        </ul>
         <div class="form">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">卡号 (ICCID)</span>
                    <yd-input ref="cardNum"  :required="true" v-model="form.iccid" regex="^[0-9A-Za-z]+$"  slot="right" :show-required-icon="false" placeholder="请输入对应卡号"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
        </div>
        <yd-button class="yesBtn" size="large" type="primary" @click.native="bindButton">{{btnName}}</yd-button>
    </div>
</template>

<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
export default {
  mixins: [api],
  name: "bandLogin",
  data() {
    return {
      // 获取验证码状态
      sendCode: false,
      btnName: '绑定流量卡',
      form: {
        // 卡号
        iccid: ""
      }
    };
  },
  methods: {
    //   绑定确认
    bindButton() {
        debugger;
      const cardNum = this.$refs.cardNum;
      console.log(cardNum);
      
      if (cardNum.valid) {
        this.bindCardNum();
      } else {
        this.$dialog.toast({
          mes: "请填写正确的卡号",
          icon: "error"
        });
      }
    },

    // 绑定卡号
    bindCardNum() {
      var nickname = JSON.parse(unescape((utils.getCookie('wxInfo')))).nickName;
      var unionid = JSON.parse(unescape((utils.getCookie('wxInfo')))).unionId;
      var openid = JSON.parse(unescape((utils.getCookie('wxInfo')))).openId;

      var params = {
        iccid: this.form.iccid,
        mobile: this.$route.query.mobile.toString(),
        nickname,
        unionid,
        openid
      };
console.log(params);
      this.post(
        "/user/bindiccid",
        params,
        data => {
          console.log(params);
          var a = JSON.parse(unescape(utils.getCookie("userInfo")));
          console.log(a);
          debugger;
          if (data.code == "0000") {
            utils.setCookie("token", JSON.stringify(data.token), 30);
            utils.setCookie("userInfo", JSON.stringify(data.user), 30);
            setTimeout(() => {
              this.$dialog.toast({
                mes: "激活成功",
                icon: "success"
              });
            }, 500);
            this.$router.replace("/index");
          }
        },
        error => {}
      );
    }
  }
};
</script>

<style scoped>
.yesBtn{
    width: 90%;
    margin: 1rem auto;
    background:#ff2d55;
        height: 0.9rem;
    font-size: 0.34rem;    
}
.left-text {
  font-size: 0.3rem;
  font-weight: 600;
  color: #333;
  margin-right: 0.1rem;
}
.first-tittle{
  color: #ff2d55;
  font-size: 0.33rem;
  padding: 0.15rem 0.4rem 0.15rem 0.4rem;
}
.second-tittle{
  color: #ff2d55;
  font-size: 0.33rem;
  padding: 0.15rem 0.4rem 0.5rem 0.4rem;
}
</style>