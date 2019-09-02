<template>
    <div class="activate">
        <yd-cell-item>
            <div slot="left">
                <span class="left-text">绑定信息:</span>
            </div>
        </yd-cell-item>
        <!-- 激活表单 -->
        <div class="form">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">卡号 (ICCID)</span>
                    <yd-input ref="cardNum"  :required="true" v-model="form.iccid" regex="^[0-9A-Za-z]+$"  slot="right" :show-required-icon="false" placeholder="请输入对应卡号"></yd-input>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">手机号</span>
                    <yd-input ref="phone" slot="left" style="width:3.5rem" :required="true" :show-required-icon="false" v-model="form.mobile" regex="/^1[23456789]\d{9}$/"  placeholder="请输入您的手机号码"></yd-input>
                    <yd-sendcode style="font-size:0.24rem" v-model="sendCode" second="45" @click.native="sendcheckCode"  storage-key="dashuaibi" slot="right" :type="setCheckbtnState" init-str="获取验证码" run-str="还剩{%s}秒" reset-str="重新发送" shape="circle"></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">验证码</span>
                    <yd-input ref="checkCode" slot="right" v-model="form.captchas"  :required="true" :show-required-icon="false" :show-error-icon="false" :show-success-icon="false" placeholder="请输入验证码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
        </div>
        <!-- 提示信息 -->
        <div class="otherInfo">
            <yd-cell-item class="otherInfo-title">
                <div slot="left">
                    <span class="left-text">激活须知</span>
                </div>
            </yd-cell-item>
            <p>1、请确保您的智能设备支持，中国联通3G/4G网络</p>
            <p>2、一旦流量卡插入设备，则不允许更换设备或卡槽</p>
        </div>
        <div class="check-btn">
            <yd-button size="large" shape="circle" bgcolor="#ff2d55" color="#fff" @click.native="sendActivate">确认并激活</yd-button>
        </div>
    </div>
</template>
 
<script>
import utils from '../../../utils/assist'
import api from '../../../utils/httpClient.vue'
export default {
  mixins: [api],
  name: "activate",
  data() {
    return {
      // 获取验证码状态
      sendCode: false,
      form: {
        // 卡号
        iccid: "",
        // 手机号
        mobile: "",
        //验证码
        captchas: ""
      }
    };
  },
  created() {
    document.title = "激活流量卡";
    this.$store.commit('updateLoadingStatus', false);
  },
  computed: {
    setCheckbtnState(){
        if(!(/^1[23456789]\d{9}$/.test(this.form.mobile))){
          return "disabled"
        }else{
          return "danger"
        }
    }
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
          this.getBindiccidApi();
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
    // 首次绑卡接口
    getBindiccidApi(){
      var nickname = JSON.parse(unescape((utils.getCookie('userInfo')))).nickName;
      var unionid = JSON.parse(unescape((utils.getCookie('userInfo')))).unionId;
      var openid =JSON.parse(unescape((utils.getCookie('userInfo')))).openId
      var params ={iccid:this.form.iccid,mobile:(this.form.mobile).toString(),captchas:this.form.captchas,nickname,unionid,openid}
      this.post('/user/bindiccid',params,(data)=>{
        console.log(params)
        var a = JSON.parse(unescape((utils.getCookie('userInfo'))))
        console.log(a)
        debugger;
          if(data.code=='0000'){
            utils.setCookie('token',JSON.stringify(data.token),30);
            utils.setCookie('userInfo',JSON.stringify(data.user),30);
              setTimeout(() => {
                    this.$dialog.toast({
                    mes: "激活成功",
                    icon: "success"
                });
                }, 500);
            this.$router.replace('/index')
          }
      },(error)=>{
      })
    },
    // // 非首次绑卡接口
    // getSecondbindApi(){
    //   var params ={iccid:this.form.iccid,mobile:(this.form.mobile).toString(),captchas:this.form.captchas}
    //   var userInfo = JSON.parse(unescape((utils.getCookie('userInfo'))));
    //   api.post('/user/secondbind',params,(data)=>{
    //     console.log(userInfo)
    //     debugger;
    //       if(data.code=='0000'){
    //           this.$dialog.toast({
    //             mes: "激活成功",
    //             icon: "success"
    //           });
    //         this.$router.replace('/index')
    //       }
    //   },(error)=>{
    //   })
    // },
    // 发送验证码
    sendcheckCode(){
      var params = {mobile:(this.form.mobile).toString(),sendType:1}
      debugger;
      this.post('/sms/sendSms',params,(data)=>{
          // debugger;
          console.log(data)
          if(data.code=="0000"){
            this.sendCode = true;
            console.log(this.sendCode)
            // debugger;
            this.$dialog.toast({
                mes: "验证码已发送",
                icon: "success"
              });
          }else{
          }
      },(error)=>{
      })
    },
    
  }
};
</script>

<style scoped>
.activate {
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
.otherInfo {
  margin-top: 0.8rem;
  color: #cbcbcb;
}
.otherInfo-title::after {
  border-bottom: 0;
}
.otherInfo > p {
  padding-left: 0.24rem;
  padding-bottom: 0.24rem;
  font-size: 0.28rem;
  color: #a4a4a4;
}
.check-btn {
  padding: 0.6rem;
}
.yd-cell:after {
  border-bottom: 0;
}
</style>