<template>
  <div class="recharge scroller">
    <yd-cell-group title="充值卡号">
      <yd-cell-item>
        <span slot="left">ICCID：</span>
        <span slot="left">{{ ICCID }}</span>
      </yd-cell-item>
      <yd-cell-item>
        <span slot="left">手机号：</span>
        <input
          slot="right"
          type="number"
          placeholder="请输入手机号"
          v-model="rechargePhone"
        />
      </yd-cell-item>
    </yd-cell-group>
    <yd-cell-group title="充值类型">
      <yd-cell-item type="radio" v-for="(item, i) in feePlanList" :key="i">
        <span slot="left">{{ item.productName }}-￥{{ item.realPrice }}</span>
        <input
          slot="right"
          type="radio"
          :value="item.feePlanId"
          v-model="feePlanId"
        />
      </yd-cell-item>
    </yd-cell-group>
    <yd-cell-group title="支付方式">
      <yd-cell-item type="radio">
        <span slot="left">微信支付</span>
        <input slot="right" type="radio" value="wx" v-model="wxPay" />
      </yd-cell-item>
    </yd-cell-group>
    <div class="rechargeTip">
      <p>未拆封激活使用的号码请勿充值！</p>
      <p>每天20.30前请充值当天到帐，其余时间隔天到帐！</p>
      <yd-button size="large" type="primary" @click.native="getOpenId"
        >去支付</yd-button
      >
    </div>
  </div>
</template>
<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
import rechargelogo from "../../../assets/rechargelogo.png";
export default {
  mixins: [api],
  name: "rechargeCardsOp",
  data() {
    return {
      feePlanList: [],
      channelFeePlanId: "",
      feePlanId: "",
      ICCID: "",
      wxPay: "wx",
      rechargePhone: "",
      openId: ""
    };
  },
  activated() {},
  mounted() {
    document.title = "确认充值";
    this.ICCID = this.$route.query.iccid;
    this.getRechargePage();
  },
  methods: {
    getOpenId() {
      if (this.rechargePhone.length == 11 || this.rechargePhone.length == 0) {
        this.get(
          "/appLogin/getweixinQrParam",
          "",
          data => {
            if (data.code == "0000") {
              var indexUrl =
                data.param.redirectUri +
                "/#/rechargeCardsPay?iccid=" +
                this.ICCID +
                "&productid=" +
                this.feePlanId +
                "&businesstype=0&mobile=" +
                this.rechargePhone;
              var state = data.param.state;
              var url =
                "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
                data.param.appId +
                "&redirect_uri=" +
                encodeURIComponent(indexUrl) +
                "&response_type=code&scope=" +
                data.param.scope +
                "&state=" +
                state +
                "#wechat_redirect";
              console.log(indexUrl);

              debugger;
              window.location.href = url;
            }
          },
          error => {}
        );
      } else {
        this.$dialog.toast({
          mes: "请填写正确的手机号码",
          timeout: 1500,
          icon: "none"
        });
      }
    },
    // 获取套餐信息
    getRechargePage() {
      var params = {
        iccid: this.ICCID
      };
      this.get(
        "/qrRecharge/rechargePage",
        params,
        data => {
          if (data.code == "0000") {
            this.feePlanList = data.feePlanList;
            this.feePlanId = data.feePlanList[0].feePlanId;
          }
        },
        error => {}
      );
    }
  }
};
</script>

<style scoped>
.recharge {
  font-family: "Microsoft YaHei";
  color: #000;
  font-size: 14px;
  line-height: 1.42857143;
  background-color: #fff;
  height: 100vh;
  padding-top: 50px;
}
.rechargeTitle {
  color: #999;
  border-bottom: 1px solid #eeeeee;
  padding-left: 16px;
  padding-bottom: 4px;
  padding-top: 2px;
}
.button.renewalBtn {
  font-size: 18px;
  padding-left: 100px;
  padding-right: 100px;
}
.button-raised.button-primary.btn-uncertification {
  border-color: #e95369;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#e95369),
    to(#ea445c)
  );
  background: linear-gradient(#e95369, #ea445c);
  height: 40px;
  color: #ffffff;
  border-radius: 200px;
  display: inline-block;
  line-height: 40px;
}
div >>> .yd-cell-title {
  background-color: #fff;
}
.rechargeTip {
  color: #ea445c;
  padding: 0 10px;
}
div >>> .yd-btn-primary {
  margin-top: 4px;
}
</style>


