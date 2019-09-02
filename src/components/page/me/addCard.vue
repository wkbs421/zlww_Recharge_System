<template>
    <div class="addCard">
        <yd-cell-item>
            <div slot="left">
                <span class="left-text">添加信息:</span>
            </div>
        </yd-cell-item>
        <ul>
          <li class="first-tittle">1. 请确保您的智能设备支持中国联通的4G/3G网络</li>
          <li class="second-tittle">2. 一旦流量卡插入设备，则不允许更换设备或卡槽</li>
        </ul>
        <!-- 表单 -->
        <div class="form">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">卡号 (ICCID)</span>
                    <yd-input ref="cardNum" v-model="form.cardNum" regex="^[0-9A-Za-z]+$" :required="true" slot="right" :show-required-icon="false" placeholder="请输入对应卡号"></yd-input>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">手机号</span>
                    <yd-input ref="phone" slot="left" style="width:3.5rem" disabled="disabled" v-model="setMobileEncrypted" ></yd-input>
                    <yd-sendcode style="font-size:0.24rem" v-model="sendCode" @click.native="sendcheckCode" storage-key="dashuaibi" slot="right" type="danger" init-str="获取验证码" run-str="还剩{%s}秒" reset-str="重新发送" shape="circle"></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">验证码</span>
                    <yd-input ref="checkCode" slot="right" v-model="form.checkCode" :required="true" :show-required-icon="false" :show-error-icon="false" :show-success-icon="false" placeholder="请输入验证码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
        </div>
        <!-- 提交按钮 -->
        <div class="check-btn">
            <yd-button size="large" shape="circle" bgcolor="#ff2d55" color="#fff" @click.native="sendActivate">确认并添加</yd-button>
        </div>
    </div>
</template>
 
<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
export default {
  mixins: [api],
  name: "activate",
  data() {
    return {
      // 获取验证码状态
      sendCode: false,
      form: {
        // 卡号
        cardNum: "",
        // 手机号
        phone: JSON.parse(unescape(utils.getCookie("userInfo"))).mobile,
        //验证码
        checkCode: ""
      }
    };
  },
  created() {
    document.title = "添加流量卡";
    this.$store.commit("updateLoadingStatus", false);
  },
  methods: {
    // 提交表单
    sendActivate() {
      // 验证表单
      const cardNum = this.$refs.cardNum;
      const phone = this.$refs.phone;
      const checkCode = this.$refs.checkCode;
      if (cardNum.valid) {
        if (phone.valid) {
          if (checkCode.valid) {
            this.getSecondbindApi();
          } else {
            this.$dialog.toast({
              mes: "请填写验证码",
              icon: "error"
            });
          }
        } else {
          this.$dialog.toast({
            mes: "请填写正确的手机号",
            icon: "error"
          });
        }
      } else {
        this.$dialog.toast({
          mes: "请填写正确的卡号",
          icon: "error"
        });
      }
    },
    // 发送验证码
    sendcheckCode() {
      var params = { mobile: this.form.phone, sendType: 1 };
      debugger;
      this.post(
        "/sms/sendSms",
        params,
        data => {
          // debugger;
          console.log(data);
          if (data.code == "0000") {
            this.sendCode = true;
            console.log(this.sendCode);
            // debugger;
            this.$dialog.toast({
              mes: "验证码已发送",
              icon: "success"
            });
          }
        },
        error => {}
      );
    },
    // 非首次绑卡接口
    getSecondbindApi() {
      var params = {
        iccid: this.form.cardNum,
        mobile: this.form.phone,
        captchas: this.form.checkCode
      };
      var userInfo = JSON.parse(unescape(utils.getCookie("userInfo")));
      this.post(
        "/user/secondbind",
        params,
        data => {
          console.log(userInfo);
          debugger;
          if (data.code == "0000") {
            setTimeout(() => {
              this.$dialog.toast({
                mes: "激活成功",
                icon: "success"
              });
            }, 500);

            this.$router.replace("/myCenter");
          }
        },
        error => {}
      );
    }
  },
  computed: {
    // 手机号加密
    setMobileEncrypted() {
      var reg = /^(\d{3})\d{4}(\d{4})$/;
      return this.form.phone.replace(reg, "$1****$2");
    }
  }
};
</script>

<style scoped>
.addCard {
  color: #333;
}
.left-text {
  font-size: 0.3rem;
  font-weight: 600;
  color: #333;
  margin-right: 0.1rem;
}
.form {
  background-color: #fff;
}
.check-btn {
  padding: 0.5rem;
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