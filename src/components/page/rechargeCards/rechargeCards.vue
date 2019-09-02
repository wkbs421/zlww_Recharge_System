<template>
  <div class="recharge scroller" v-if="loading">
    <header>
      <div class="container lt-part1">
        <div class="header-wrap">
          <div class="img-container">
            <img src="../../../assets/rechargelogo.png" class="logol" />
          </div>
          <div class="lt-part1-simInfo">
            ICCID:<span id="cardNo">{{ iccidInfo.ICCID }}</span>
            <div class="simInfo">
              <span id="IMEInum"
                >物联卡号:<i>{{ iccidInfo.cardNo }}</i></span
              >
            </div>
          </div>
        </div>
      </div>
    </header>
    <div class="mainBlock">
      <!--流量-->
      <div class="container" id="history">
        <div class="innerContainer">
          <!--第一行-->
          <div class="resetTip">
            <p class="cardTag pull-left">
              <span
                style="display: inline-block;"
                class="btn-top pointer c-green cardState-normal"
                v-if="iccidInfo.cardStatus == 0"
                >未激活</span
              >
              <span
                style="display: inline-block;"
                class="btn-top pointer c-green cardState-normal"
                v-if="iccidInfo.cardStatus == 1"
                >正常</span
              >
              <span
                style="display: inline-block;"
                class="btn-top pointer c-green cardState-normal"
                v-if="iccidInfo.cardStatus == 2"
                >已停机</span
              >
              <span
                style="display: inline-block;"
                class="btn-top pointer c-green cardState-normal"
                v-if="iccidInfo.cardStatus == 3"
                >已注销</span
              >
              <span
                id="amountUsageData"
                style="padding-left:10px;color:#353535;"
                v-if="iccidInfo.cardStatus"
                >总量 {{ iccidInfo.availableflow }}M</span
              >
            </p>
            <div
              class="pull-right date-info"
              id="dOrMTip1"
              style="display: block;"
              v-if="iccidInfo.cardStatus == 1"
            >
              已使用<span id="lastDays1"></span>{{ iccidInfo.usedflow
              }}<span id="dOrM1">M</span>
            </div>
          </div>

          <!--第二行-->
          <div class="leftFlowTxt" v-if="iccidInfo.cardStatus == 0">
            <span class="surplusFlowContent"
              ><sub
                style="bottom:.1em;font-size:55%;padding-right:10px;"
                class="surplusFlowText"
                >未激活</sub
              ><span class="surplusFlow">请激活<sub></sub></span
            ></span>
          </div>
          <div class="leftFlowTxt" v-if="iccidInfo.cardStatus == 1">
            <span class="surplusFlowContent"
              ><sub
                style="bottom:.1em;font-size:55%;padding-right:10px;"
                class="surplusFlowText"
                >剩余</sub
              ><span class="surplusFlow"
                >{{ iccidInfo.surplusflow }}<sub>M</sub></span
              ></span
            >
          </div>
          <div class="leftFlowTxt" v-if="iccidInfo.cardStatus == 2">
            <span class="surplusFlowContent"
              ><sub
                style="bottom:.1em;font-size:55%;padding-right:10px;"
                class="surplusFlowText"
                >停机</sub
              ><span class="surplusFlow">请充值<sub></sub></span
            ></span>
          </div>
          <div class="leftFlowTxt" v-if="iccidInfo.cardStatus == 3">
            <span class="surplusFlowContent"
              ><sub
                style="bottom:.1em;font-size:55%;padding-right:10px;"
                class="surplusFlowText"
                >已注销</sub
              ><span class="surplusFlow"><sub></sub></span
            ></span>
          </div>

          <!--第三行-->
          <div class="flowState" v-if="iccidInfo.cardStatus == 0">
            注：您的卡还未激活，请尽快将卡插入设备使用
          </div>
          <div class="flowState" v-if="iccidInfo.cardStatus == 2">
            注：停机一个月内未充值该卡将被注销
          </div>
          <div class="flowState" v-if="iccidInfo.cardStatus == 3">
            注：您的卡已被注销
          </div>
        </div>
      </div>
      <!--套餐tab切换-->
      <div
        class="container"
        v-if="iccidInfo.cardStatus == 1 || iccidInfo.cardStatus == 2"
      >
        <div class="wrap" id="tabs_package">
          <div class="tabs">
            <a hidefocus="true" class="active">当前套餐</a>
            <a hidefocus="true" class="actived">&nbsp;</a>
          </div>
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide">
                <div
                  class="content-slide"
                  id="nowPackageList"
                  style="overflow:auto;"
                >
                  <p id="currentPackage">套餐名称:{{ iccidInfo.pckName }}</p>
                  <p id="currentPackageInfo">{{ iccidInfo.productDesc }}</p>
                  <p class="packagePrice">
                    续费价格: <span>{{ "¥" + iccidInfo.pckPrice }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--end tab切换-->
    </div>
    <footer>
      <div class="container text-center" style="position: relative">
        <a
          @click="getOpenId"
          class="button button-raised button-primary button-pill btn-uncertification renewalBtn"
          >充值续费</a
        >
        <div class="f-link">
          <a class="f-flowDetail">
            特别提醒：本卡不能用于机器远程激活使用，因为远程更新需要消耗5到10M的流量。会导致超出套餐流量造成停机。远程激活的支付品牌有：卡友，拉卡拉等。</a
          >
        </div>
      </div>
    </footer>
  </div>
</template>
<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
import { log } from "util";
export default {
  mixins: [api],
  name: "rechargeCards",
  data() {
    return {
      loading: false,
      iccidInfo: {},
      openId: ""
    };
  },
  mounted() {
    document.title = "移动物联卡信息";
  },
  created() {
    this.getRechargeCards();
  },
  methods: {
    toLink(link) {
      this.$router.push(link);
    },
    // 获取卡信息页面
    getRechargeCards() {
      var params = {
        msisdn: this.$route.query.cardNo
      };
      this.get(
        "/recharge/pageInfo",
        params,
        data => {
          if (data.code == 1) {
            this.loading = true;
            data.data.cardStatus = 1;
            this.iccidInfo = data.data;
          }
        },
        error => {}
      );
    },
    getOpenId() {
      if (this.iccidInfo.pckPrice <= 0) {
        this.$dialog.toast({
          mes: "该套餐目前不支持续费",
          timeout: 1600
        });
        return;
      }
      this.get(
        "/recharge/getweixinQrParam",
        "",
        data => {
          if (data.code == 1) {
            var indexUrl =
              data.data.redirectUri +
              "/#/rechargeCardsPay?cardNo=" +
              this.iccidInfo.cardNo +
              "&businesstype=0";
            var state = data.data.state;
            var url =
              "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
              data.data.appId +
              "&redirect_uri=" +
              encodeURIComponent(indexUrl) +
              "&response_type=code&scope=" +
              data.data.scope +
              "&state=" +
              state +
              "#wechat_redirect";
            debugger;
            console.log(indexUrl);

            console.log(url);

            window.location.href = url;
          }
        },
        error => {}
      );
    }
  }
};
</script>

<style scoped>
body {
  background-color: #ffffff;
}
.recharge {
  font-family: "Microsoft YaHei";
  color: #999;
  font-size: 14px;
  line-height: 1.42857143;
  background-color: #fff;
  height: 100vh;
}
.container {
  padding-left: 10px;
  padding-right: 10px;
}
.lt-part1 {
  overflow: auto;
  position: relative;
  padding-top: 5px;
  padding-bottom: 5px;
}
.lt-part1 .img-container {
  float: left;
  text-align: center;
  border-right: 1px solid #ddd;
  width: 100px;
  height: 54px;
  line-height: 54px;
}
.lt-part1 .img-container .logol {
  max-width: 100%;
}
.lt-part1-simInfo {
  padding-left: 111px;
  color: #000;
}
.lt-part1-simInfo #cardNo {
  color: #2089e9;
  display: inline-block;
  font-size: 18px;
  font-weight: bold;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}
@media (max-width: 395px) {
  .lt-part1-simInfo #cardNo {
    font-size: 16px;
  }
}
.lt-part1-simInfo .simInfo {
  color: #333;
}
#IMEInum i {
  font-style: normal;
  font-weight: bold;
  font-size: 16px;
}
.innerContainer {
  filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr='#e95369',endColorStr='#fff',gradientType='0');
  background: -moz-linear-gradient(top, #e95369, #fff);
  background: -o-linear-gradient(top, #e95369, #fff);
  background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#e95369), to(#fff));
  padding: 5px;
}
.flowTips,
.cardTag {
  margin-bottom: 0;
  padding: 4px 7px;
}
.pull-left {
  float: left !important;
}
.c-green {
  color: #ffffff;
  border-color: #4dcb7d;
  transition: 1s;
}
.btn-top {
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 1px 10px;
  display: inline-block;
  margin-right: 5px;
}
.date-info {
  color: #333;
  padding: 4px;
  display: none;
}
.pull-right {
  float: right !important;
}
.leftFlowTxt {
  text-align: center;
  position: relative;
  clear: both;
  color: #ea445c;
  font-weight: bold;
}
.surplusFlowContent {
  font-size: 38px;
}
sub,
sup {
  position: relative;
  font-size: 60%;
  line-height: 0;
  vertical-align: baseline;
  bottom: 0px;
  font-weight: normal;
}
.flowState {
  overflow: hidden;
  margin-top: 10px;
  font-size: 13px;
  color: #353535;
  text-align: center;
}
.wrap {
  overflow: hidden;
  background-color: #fff;
}
.tabs {
  height: 40px;
}
.tabs a {
  display: block;
  float: left;
  width: 50%;
  color: #333;
  text-align: center;
  line-height: 40px;
  font-size: 16px;
  text-decoration: none;
  border-bottom: 1px solid #ddd;
}
.tabs a.active {
  color: #ea445c;
  border-radius: 5px 5px 0px 0px;
  border-color: #ea445c;
}
.tabs a.actived {
  color: #000;
  border-radius: 5px 5px 0px 0px;
  border-color: #ea445c;
}
.swiper-container {
  border-radius: 0 0 5px 5px;
  width: 100%;
  border-top: 0;
}
.swiper-container {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
  -ms-backface-visibility: hidden;
  -o-backface-visibility: hidden;
  backface-visibility: hidden;
  z-index: 1;
}
.swiper-wrapper {
  position: relative;
  width: 100%;
  -webkit-transition-property: -webkit-transform, left, top;
  -webkit-transition-duration: 0s;
  -webkit-transform: translate3d(0px, 0, 0);
  -webkit-transition-timing-function: ease;
  -moz-transition-property: -moz-transform, left, top;
  -moz-transition-duration: 0s;
  -moz-transform: translate3d(0px, 0, 0);
  -moz-transition-timing-function: ease;
  -o-transition-property: -o-transform, left, top;
  -o-transition-duration: 0s;
  -o-transform: translate3d(0px, 0, 0);
  -o-transition-timing-function: ease;
  -o-transform: translate(0px, 0px);
  -ms-transition-property: -ms-transform, left, top;
  -ms-transition-duration: 0s;
  -ms-transform: translate3d(0px, 0, 0);
  -ms-transition-timing-function: ease;
  transition-property: transform, left, top;
  transition-duration: 0s;
  transform: translate3d(0px, 0, 0);
  transition-timing-function: ease;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
.swiper-slide {
  width: 100%;
  background: none;
  color: #999;
}
.swiper-slide {
  float: left;
  -webkit-box-sizing: content-box;
  -moz-box-sizing: content-box;
  box-sizing: content-box;
}
.swiper-slide {
  height: auto !important;
}
.content-slide {
  padding: 5px;
}
#currentPackage {
  margin-bottom: 5px;
  color: #000;
}
#currentPackageInfo {
  font-size: 13px;
}
.packagePrice {
  margin-bottom: 5px;
  color: #000;
}
.packagePrice > span {
  font-size: 20px;
  color: #e95369;
}
footer {
  position: absolute;
  left: 0;
  bottom: 0px;
  width: 100%;
  padding-top: 10px;
  padding-bottom: 10px;
  background-color: #fff;
}
.text-center {
  text-align: center;
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
.f-link {
  margin-top: 15px;
}
.f-link a {
  color: #ea445c;
}
</style>


