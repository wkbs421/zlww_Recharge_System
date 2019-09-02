<template>
  <div class="recharge scroller">
    支付中,请稍候~~
  </div>
</template>
<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
import { log } from "util";
export default {
  mixins: [api],
  name: "rechargeCardsPay.vue",
  data() {
    return {
      params: {},
      feePlanId: "",
      cardNo: "",
      rechargePhone: "",
      openId: "",
      code: "",
      state: ""
    };
  },
  mounted() {
    document.title = "支付页面";
  },
  created() {
    debugger;
    this.cardNo = this.$route.query.cardNo;
    this.code = this.getUrlParam("code");
    this.state = this.getUrlParam("state");
    this.toLoading();
  },
  methods: {
    toLoading() {
      var params = {
        code: this.code,
        state: this.state
      };
      this.get(
        "/recharge/getQrOpenId",
        params,
        data => {
          if (data.code == 1) {
            this.openId = data.data.openId;
            this.getWxpayApi();
          }
        },
        error => {
          console.log("getQrOpenId接口错误");
          console.log(error);
        }
      );
    },
    // 微信支付Api
    getWxpayApi() {
      console.log(-2);
      var params = {
        msisdn: this.cardNo,
        openId: this.openId
      };
      console.log(-1);
      this.post(
        "/wxpay/createOrder",
        params,
        data => {
          this.params = data.data.payparam;
          // if (data.code == 1) {
          console.log(0);
          if (typeof WeixinJSBridge == "undefined") {
            console.log(1);
            if (document.addEventListener) {
              console.log(2);
              document.addEventListener(
                "WeixinJSBridgeReady",
                this.onBridgeReady,
                false
              );
            } else if (document.attachEvent) {
              console.log(3);
              document.attachEvent("WeixinJSBridgeReady", this.onBridgeReady);
              document.attachEvent("onWeixinJSBridgeReady", this.onBridgeReady);
            }
          } else {
            console.log(4);
            this.onBridgeReady();
          }
          // }
        },
        error => {
          console.log("getWxpayApi接口错误");
        }
      );
    },
    // 微信支付回调
    onBridgeReady() {
      console.log("触发onBridgeReady");
      var params = this.params;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: params.appId, //公众号名称，由商户传入
          timeStamp: params.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: params.nonceStr, //随机串
          package: params.package,
          signType: "MD5", //微信签名方式：
          paySign: params.paySign //微信签名
        },
        res => {
          console.log("触发onBridgeReady结束");
          console.log(res);
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // this.$router.replace("/rechargeCards?cardNo=" + this.cardNo);
            this.$router.replace({
              path: "/rechargeCardsResult",
              query: { state: true }
            });
          } else if (res.err_msg == "get_brand_wcpay_request:cancel") {
            WeixinJSBridge.call("closeWindow");
          } else if (res.err_msg == "get_brand_wcpay_request:fail") {
            this.$router.replace({
              path: "/rechargeCardsResult",
              query: { state: false }
            });
            /* this.$dialog.toast({
              mes: "支付异常，请稍候重新支付~~",
              timeout: 1500,
              icon: "none"
            }); */
          }
        }
        // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
      );
    },
    // 获取URL参数
    getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg); //匹配目标参数
      if (r != null) return decodeURI(r[2]);
      return null; //返回参数值
    }
  }
};
</script>

<style scoped>
body {
  background-color: #ffffff;
}
.recharge {
  text-align: center;
  font-size: 16px;
  padding-top: 60px;
  color: blue;
}
</style>


