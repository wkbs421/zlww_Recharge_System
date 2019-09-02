<template>
    <div>
        <div style="width: 100%; height: 2rem;"></div>
        <div class="form">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">手机号</span>
                    <yd-input ref="phone" slot="left" style="width:3.5rem" :required="true" :show-required-icon="false" v-model="form.mobile" regex = "/^1[23456789]\d{9}$/"  placeholder="请输入您的手机号码"></yd-input>
                    <yd-sendcode style="font-size:0.24rem" v-model="sendCode" second="45" @click.native="sendcheckCode"  storage-key="dashuaibi" slot="right" :type="setCheckbtnState" init-str="获取验证码" run-str="还剩{%s}秒" reset-str="重新发送" shape="circle"></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">验证码</span>
                    <yd-input ref="checkCode" slot="right" v-model="form.captchas"  :required="true" :show-required-icon="false" :show-error-icon="false" :show-success-icon="false" placeholder="请输入验证码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
        </div>
     <yd-button class="yesBtn" size="large" type="primary" shape="circle" @click.native="loginButton">{{btnName}}</yd-button>

    </div>
</template>

<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
export default {
  mixins: [api],
  name: "otherLogin",
  btnName:'wodeanniu',
  data() {
    return {
      // 获取验证码状态
      sendCode: false,
      form: {
        // 手机号
        mobile: "",
        //验证码
        captchas: ""
      }
    };
  },
  computed: {
    setCheckbtnState() {
      if (!/^1[23456789]\d{9}$/.test(this.form.mobile)) {
        return "disabled";
      } else {
        return "danger";
      }
    }
  }
};
</script>

<style scoped>
.yesBtn{
    width: 50%;
    margin: 0 auto;
    margin: 0.5rem auto;
}
</style>