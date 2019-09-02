<template>
    <div style="color: #333;">
      <yd-cell-item>
            <div slot="left">
                <span class="left-text">手机号信息：</span>
            </div>
        </yd-cell-item>
        <!-- <div class="first-tittle">请确保您的只能设备支持中国联通的4G/3G网络</div>
        <div class="first-tittle">一旦流量卡插入设备，则不润徐更换设备或卡槽</div> -->
        <div class="form">
            <yd-cell-group>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">手机号</span>
                    <yd-input ref="phone" slot="left" style="width:3.5rem" :required="true" :show-required-icon="false" v-model="form.mobile"  regex = "/^1[23456789]\d{9}$/" placeholder="请输入您的手机号码"></yd-input>
                    <yd-sendcode style="font-size:0.24rem" v-model="sendCode" second="45" @click.native="sendcheckCode"   slot="right" :type="setCheckbtnState" init-str="获取验证码" run-str="还剩{%s}秒" reset-str="重新发送" shape="circle"></yd-sendcode>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" style="margin-right:0.3rem">验证码</span>
                    <yd-input ref="checkCode" slot="right" v-model="form.captchas"  :required="true" :show-required-icon="false" :show-error-icon="false" :show-success-icon="false" placeholder="请输入验证码"></yd-input>
                </yd-cell-item>
            </yd-cell-group>
        </div>
     <yd-button class="yesBtn" size="large" type="primary" @click.native="loginButton">{{btnName}}</yd-button>

    </div>
</template>

<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
export default {
  mixins: [api],
  name: "phoneLogin",
  
  data() {
    return {
      // 获取验证码状态
      btnName: "wodeanniu",
      sendCode: false,
      form: {
        // 手机号
        mobile: "",
        //验证码
        captchas: ""
      }
    };
  },
  created() {
    console.log("关联手机账号pppppppppppppppppppppppp00000")
    if (this.$route.query.type == 1) {
      this.btnName = "登录";
    } else {
      this.btnName = "关联手机账号";
    }
    
  },
  computed: {
    setCheckbtnState() {
      if (!/^1[23456789]\d{9}$/.test(this.form.mobile)) {
        return "disabled";
      } else {
        return "danger";
      }
    }
  },
  methods: {
      // 发送验证码
    sendcheckCode(){
        var codeType = 1;
        if(this.btnName == "登录"){
          // 退出
            codeType = 2;
        }
      var params = {mobile:(this.form.mobile).toString(),sendType:codeType}
      console.log(params);
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
    //点击登录
    loginButton() {
      const phone = this.$refs.phone;
      const checkCode = this.$refs.checkCode;
      if (phone.valid) {
        if (checkCode.valid) {
          this.checkPhoneNum();
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
    },
    // 验证手机号码
    checkPhoneNum() {
      var params = {
        mobile: this.form.mobile.toString(),
        captchas: this.form.captchas
      };
      this.post(
        "/user/mobileIsExist",
        params,
        data => {
          console.log(params);
          if (this.$route.query.type == 1) {
            //   登录
            if (data.code == "0000") {
              utils.setCookie("userInfo", JSON.stringify(data.user), 30);
              utils.setCookie("token", JSON.stringify(data.token), 30);
              this.$router.push("/index");
            } else if (data.code == "0007") {
              // 没有绑卡的情况
              this.$dialog.alert({
                mes: "您还没有绑定的卡,请先进行绑定",
                callback: () => {
                  //if(this.$route.query.backLogin == 0){
                    // 退出
                    this.$router.push({path: '/bandCard', query: {mobile: this.form.mobile.toString()}});
                  /*}else{
                    // this.$router.go(-1);
                    if(this.btnName == "登录"){
                    console.log("关联手机账号1111")
                    this.btnName = "关联手机账号";
                    this.captchas = '';
                    this.sendCode = false;
                    }else{
                      this.$router.push({path: '/bandCard', query: {mobile: this.form.mobile.toString()}});
                    }          
                  }*/
                }
              });
            }
          } else {
            if (data.code == "0000") {
              // 您已经帮过卡了
              this.$dialog.alert({
                mes: "您已经绑定过卡，请登录",
                callback: () => {
                  // this.$router.go(-1);
                  //if(this.btnName == "登录"){
                    utils.setCookie('userInfo',JSON.stringify(data.user),30);
                    utils.setCookie("token", JSON.stringify(data.token), 30);
                   // utils.setCookie('wxInfo',JSON.stringify(data.wxInfo),30);
                    this.$router.push('/index');
                 /* }else{
                  console.log("关联手机账号2222")
                  this.btnName = "登录";
                  this.captchas = '';
                  this.sendCode = false;
                  }  */    
                }
              });
            } else if (data.code == "0007") {
              this.$router.push({path: '/bandCard', query: {mobile: this.form.mobile.toString()}});
            }
          }
        },
        error => {}
      );
    }
  }
};
</script>

<style scoped>
.yesBtn {
  width: 90%;
  margin: 1rem auto;
  background:#ff2d55;
  height: 0.9rem;
  font-size: 0.34rem;
}

</style>