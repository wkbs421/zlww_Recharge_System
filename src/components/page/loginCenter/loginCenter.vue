<template>
    <div>
        <div class="topDiv">
            <img class="topHeaderImage" :src="headPic">
            <div class="nickName">{{nickName}}</div>
            <p>登录平台享受更多权益</p>
        </div>
        <div class="hint-Tittle">{{hintTittle}}</div>
        <yd-button class="yesBtn" size="large" type="primary"  @click.native="loginButton">{{btnName}}</yd-button>
        <yd-button class="otherBtn" size="large" type="primary" @click.native="otherLoginButton">手机账号登录</yd-button>
    </div> 
</template>

<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
export default {
  mixins: [api],
  name: "loginCenter",
  data() {
    return {
      hintTittle:"为了给您更好的服务，请关联一个系统账号，若还没有系统账号，则注册后默认关联",
      btnName: "立即关联/快速注册"
    };
  },
  created() {
    document.title = "登录";
    if (this.$route.query.isBack == 0) {
      // 退出登录
      this.btnName = "确认登录";
      this.hintTittle = "您的微信账号已绑定系统账号，是否直接登录";
      this.headPic="";
      this.nickName = "";
    }
    this.headPic=JSON.parse(unescape((utils.getCookie('wxInfo')))).headPic;
    this.nickName=JSON.parse(unescape((utils.getCookie('wxInfo')))).nickName;
    // 取出微信头像
    console.log(JSON.parse(unescape((utils.getCookie('wxInfo')))).headPic)
    history.pushState({ page: "state1" }, "state", "#state1");
    history.pushState({ page: "state2" }, "state", "#state2");

    window.addEventListener(
      "popstate",
      function(e) {
        console.log("我监听到了浏览器的返回按钮事件啦" + event.state.page);
        if (event.state.page === "state1") {
          WeixinJSBridge.call("closeWindow");
        }
      },
      false
    );
  },

  methods: {
    otherLoginButton() {
      // 其他方式登录不变
      console.log(this.$route.query.isBack + "ppppppppppppppppppppp");
      if (this.$route.query.isBack == 0) {
        // tuichu
        this.$router.push({
          path: "/phoneLogin",
          query: { type: "1", backLogin: "0" }
        });
      } else {
        this.$router.push({
          path: "/phoneLogin",
          query: { type: "1", backLogin: "1" }
        });
      }
    },
    loginButton() {
      if (this.$route.query.isBack == 0) {
        // 退出后我选择确认登录
        this.backLogin();
      } else {
        // 我选择了其他登录方式
        this.choseOtherLogin();
      }
    },
    choseOtherLogin() {
      this.$router.push({ path: "/phoneLogin", query: { type: "2" } });
    },
    backLogin() {
      this.$router.push("/login");
    }
  }
};
</script>

<style scoped>
.topDiv {
    height: 3rem;
    width: 100%;
    color: #a9a9aa;
    display: inline-block;
}
.topDiv p{
    text-align: center;
    margin-top: 0.2rem;
    margin-top: 0.1rem;
}
.nickName{
  text-align: center;
  color: #000;
  font-size: 0.3rem;
  margin-top: 0.2rem;
}
.topHeaderImage {
    height: 1.5rem;
    width: 1.5rem;
    margin: 0 auto;
    -ms-flex-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    margin-top: 0.8rem;
    border-radius: 1.5rem;
}
.yesBtn {
  width: 64%;
  margin: 0 auto;
  margin-top: 0.8rem;
  background: #ff2d55;
  height: 0.9rem;
  font-size: 0.34rem;
  border-radius: 0.9rem;
}
.otherBtn {
  width: 64%;
  margin: 0 auto;
  margin: 0.3rem auto;
  background: white;
  color: #ff2d55;
  height: 0.9rem;
  font-size: 0.34rem;
  border:1px solid #ff2d55;
  border-radius: 0.9rem;
}
.hint-Tittle{
  font-size: 0.3rem;
  padding: 0.4rem 0.4rem 0.2rem 0.4rem;
  color:  #000;
}
</style>