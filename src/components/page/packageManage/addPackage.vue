<template>
    <div>
        <div class="head">
            <yd-cell-item class="border-none">
                <span slot="left" class="left-text white">{{cardNum | formatCardNum}}</span>
                <span slot="right" class="change" @click="showPop"><img src="../../../assets/qh_ic.png" alt="" class="change-icon">切换</span>
            </yd-cell-item>
            <div class="default-text white"><span v-if="isDefaultNumcard">默认 </span>充值卡号 (ICCID)</div>
        </div>
        <!-- 选项卡 -->
        <div style="padding-bottom:1.2rem">
            <yd-tab active-color="#ff2d55" :callback="changeTab">
                <!-- 套餐选型 -->
                <yd-tab-panel label="基础套餐" :active="defalutItem" :tabkey="0">
                    <div style="background:#f4f4f4">
                        <yd-cell-item class="border-none">
                            <img src="../../../assets/sy-jjtc_ic.png" slot="icon" alt="" class="item-icon">
                            <span slot="left">基础套餐，分月到账，当月有效</span>
                        </yd-cell-item>
                        <!-- 套餐列表 -->
                        <div class="list-box">
                            <div class="flex">
                                <template v-for="(item,i) in MeanList">
                                    <div class="flex-item" :key="i" direction="vertical" align="center" :ref="`itemA${i}`" @click="toCheck(`itemA${i}`,item)">
                                        <!-- <div class="list-icon"><img src="../../../assets/tj_ic.png" alt="" v-if="true"></div> -->
                                        <div class="list-icon" v-if="item.isPopular"><img src="../../../assets/hot_ic.png" alt=""/></div>
                                        <p class="package-flow">{{item.productName}}</p>
                                        <p class="package-price">¥ {{item.realPrice}}</p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </yd-tab-panel>
                <!-- 加油包选项 -->
                <yd-tab-panel label="加油包" :active="!defalutItem" :tabkey="1">
                    <div style="background:#f4f4f4">
                        <yd-cell-item class="border-none">
                            <img src="../../../assets/zc_jyb_ic.png" slot="icon" alt="" class="item-icon">
                            <span slot="left">加油包，即冲即到，当月有效</span>
                        </yd-cell-item>
                        <!-- 加油包列表 -->
                        <div class="list-box">
                            <div class="flex">
                                <template v-for="(item,i) in RefuelList">
                                    <div class="flex-item2" :key="i" direction="vertical" align="center" :ref="`itemC${i}`" @click="toCheck2(`itemC${i}`,item)">
                                        <!-- <div class="list-icon"><img src="../../../assets/tj_ic.png" alt="" v-if="true"></div> -->
                                        <div class="list-icon" v-if="item.isPopular"><img src="../../../assets/hot_ic.png" alt=""></div>
                                        <p class="package-flow2">{{item.productName}}</p>
                                        <p class="package-price2">¥ {{item.realPrice}}</p>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </yd-tab-panel>
            </yd-tab>
        </div>
        <!-- 订单信息 -->
        <div class="bottom">
            <p  style="width:4.5rem;padding:0.15rem 0" class="overfont">支付金额: <span class="pink">{{orderInfo.realPrice || 0}}元</span></p>
            <!-- <p style="color:#999;font-size:0.22rem;padding-top:0.1rem;width:4.5rem" class="overfont">
                总额: {{orderInfo.flowValue || 0}} x {{orderInfo.realPrice || 0}}个月 优惠: 00.00元
            </p> -->
            <div class="checkOrder" @click="sendOrder">订单确认</div>
        </div>
        <!-- 切换卡号弹窗 -->
        <yd-popup v-model="show1" position="bottom" height="45%">
            <yd-cell-item class="border">
                <span slot="left" @click="cancelPop">
                    取消
                </span>
                <span slot="right" style="color:green">
                    <span  @click="confirmPop">确定</span>
                </span>
            </yd-cell-item>
            <mt-picker :slots="slots" @change="onValuesChange">
            </mt-picker>
        </yd-popup>
    </div>
</template>

<script>
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";

export default {
  mixins: [api],
  name: "addPackage",
  data() {
    return {
      // 默认选项卡
      defalutItem: true,
      // 弹窗状态
      show1: false,
      // 弹窗显示数据
      slots: [
        {
          flex: 1,
          // 卡号列表
          values: [],
          className: "slot1",
          textAlign: "center"
        }
      ],
      // 选择卡号
      cardNum: "",
      // 默认卡号
      defaultCardNum: "",
      // 弹窗中选中的卡号
      checkedCarNum: "",
      // 套餐列表
      MeanList: [],
      // 加油包列表
      RefuelList: [],
      // 将提交的订单信息
      orderInfo: "",
      // 选定的基础套餐
      checkedMean: {},
      // 选定的加油包
      checkedRefuel: {}
    };
  },
  created() {
    this.getdefalutItem(true);
    this.getUserCardList(true);
    // Promise.all(this.getdefalutItem(true),this.getUserCardList(true)).then(()=>{
    //     this.$store.commit('updateLoadingStatus', false);
    // })
    // this.getdefalutItem()
    // this.getUserCardList()
    document.title = "全国流量充值";
  },

  methods: {
    // 设置默认选项卡
    getdefalutItem() {
      if (this.$route.query.enter == "0") {
        this.defalutItem = true;
      } else {
        this.defalutItem = false;
      }
    },
    // 获取套餐列表Api
    getFeeplanlistApi() {
      var params = { iccid: this.cardNum };
      this.get(
        "/feeplan/feeplanlist",
        params,
        data => {
          if (data.code == "0000") {
            this.MeanList = data.feeplan;
            console.log(data.feeplan);
            for (var list of data.feeplan) {
              console.log(list);
              list.productName = this.getComeOnName(list)+" x "+this.getBaseName(list);
            }
          }
        },
        error => {}
      );
    },
    // 获取加油包列表Api
    getFlowpackagelistApi() {
      var params = { iccid: this.cardNum };
      this.get(
        "/flowpackage/flowpackagelist",
        params,
        data => {
          if (data.code == "0000") {
            this.RefuelList = data.flowpackage;
            for (var list of data.flowpackage) {
              list.productName = this.getComeOnName(list);
            }
          }
        },
        error => {}
      );
    },

// 加油包
    getComeOnName(refuelList) {
      var flowValue = parseFloat(refuelList.flowValue);
      var aaa = flowValue;
      if (flowValue > 1023) {
        flowValue = (flowValue / 1024).toFixed(1);
        if (flowValue.split(".")[1] == 0) {
          var aaa = flowValue.split(".")[0];
          aaa = aaa + "G";
        } else {
          aaa = flowValue + "G";
        }
      } else {
        aaa = aaa + "M";
      }

      console.log(aaa);
      //   var listName = refuelList.flowValue;
      //   if (parseDouble(refuelList.flowValue) > 1024) {
      //     listName = document.write(refuelList.flowValue % 1024);
      //   }
      //   console.log(listName);
      return aaa;
    },
    // 基础套餐
    getBaseName(baseList) {
      var baseName = baseList.validMonth;
      if (baseList.validMonth == 3) {
        baseName = "季度";
      } else if (baseList.validMonth == 6) {
        baseName = "半年";
      } else if (baseList.validMonth == 12) {
        baseName = "1年";
      }else{
        baseName = baseName+"月";
      }
      return baseName;
    },

    // 切换基础套餐
    toCheck(name, obj) {
      // console.log(name);
      // console.log(obj);
      var arr = document.getElementsByClassName("flex-item");
      // console.log("555555555555");
      // console.log(arr);
      for (const i in arr) {
        if (arr.hasOwnProperty(i)) {
          // console.log(arr[i].children)
          arr[i].classList.remove("checked");
          arr[i].children[arr[i].children.length - 1].classList.remove(
            "checked"
          );
        }
      }
      this.$refs[name][0].classList.add("checked");
      this.$refs[name][0].children[
        this.$refs[name][0].children.length - 1
      ].classList.add("checked");
      this.checkedMean = Object.assign({}, obj);
      this.orderInfo = Object.assign({ businesstype: 0 }, this.orderInfo, obj);
    },
    // 切换加油包
    toCheck2(name, obj) {
      var arr = document.getElementsByClassName("flex-item2");
      for (const i in arr) {
        if (arr.hasOwnProperty(i)) {
          arr[i].classList.remove("checked2");
          arr[i].children[arr[i].children.length - 1].classList.remove(
            "checked2"
          );
        }
      }
      this.$refs[name][0].classList.add("checked2");
      this.$refs[name][0].children[
        this.$refs[name][0].children.length - 1
      ].classList.add("checked2");
      this.checkedRefuel = Object.assign({}, obj);
      this.orderInfo = Object.assign({ businesstype: 1 }, this.orderInfo, obj);
    },
    // 获取用户绑定的ICCID列表
    getUserCardList(asyn) {
      this.get(
        "/user/iccidlist",
        "",
        data => {
          if (data.code == "0000") {
            // 如果没有卡则引导到绑卡界面
            if (data.cardlist.length == 0) {
              this.$dialog.alert({
                mes: "您还没有绑定的卡,请先进行绑定",
                callback: () => {
                  this.$router.push("/addCard");
                }
              });
            } else {
              var cardArr = data.cardlist.map(element => {
                if (element.isdefault === "1") {
                  this.defaultCardNum = element.ICCID;
                }
                return element.ICCID;
              });
              //  console.log(cardArr)
              // 如果路由有传卡号,则使用传过来的卡号
              if (this.$route.params.cardNum) {
                this.cardNum = this.$route.params.cardNum;
              } else {
                // 如果有默认卡则显示默认卡,如没有则显示第一张卡
                if (this.defaultCardNum) {
                  this.cardNum = this.defaultCardNum;
                } else {
                  this.cardNum = cardArr[0];
                }
              }
              this.slots[0].values = cardArr;
              this.getFeeplanlistApi();
              this.getFlowpackagelistApi();
            }
          }
        },
        error => {},
        asyn
      );
    },
    // 弹窗中选中值
    onValuesChange(picker, values) {
      this.checkedCarNum = values[0];
    },
    // 取消弹窗
    cancelPop() {
      this.show1 = false;
    },
    // 显示弹窗
    showPop() {
      this.show1 = true;
    },
    // 弹窗确认
    confirmPop() {
      this.cancelPop();
      if (this.cardNum == this.checkedCarNum) {
        return;
      } else {
        this.cardNum = this.checkedCarNum;
        this.getFeeplanlistApi();
        this.getFlowpackagelistApi();
      }
    },
    // 订单确认
    sendOrder() {
      console.log(this.orderInfo);
      if (!(this.orderInfo === "")) {
        this.$router.push({
          name: "checkOrder",
          params: {
            orderInfo: this.orderInfo,
            cardNum: this.cardNum
          }
        });
      } else {
        this.$dialog.toast({
          mes: "请选择需要购买的服务",
          timeout: 1500,
          icon: "none"
        });
      }
    },
    // 切换选项卡
    changeTab(label, tabkey) {
      this.orderInfo = tabkey ? this.checkedRefuel : this.checkedMean;
    }
  },
  filters: {
    // 格式化卡号
    formatCardNum(CardNum) {
      var CardNum = CardNum.split(/(\w{4})/);
      CardNum = CardNum.filter((ele, i) => {
        return !(ele === "");
      });
      CardNum = CardNum.join("-");
      return CardNum;
    }
  },
  computed: {
    // 判断选择的是否为默认卡
    isDefaultNumcard() {
      return this.cardNum == this.defaultCardNum ? true : false;
    }
    // 订单金额统计
    // getTotalPrice(){
    //     console.log(this.orderInfo.flowValue)
    //     // debugger;
    //     if(!(this.orderInfo==='')){
    //         return this.orderInfo.flowValue * this.orderInfo.realPrice
    //     }else{
    //         return 0.00
    //     }
    // }
  }
};
</script>

<style scoped>
.head {
  background-color: #ff2d55;
}
.border-none::after {
  border: 0;
}
.left-text {
  font-size: 0.32rem;
}
.white {
  color: #fff;
}
.change {
  font-size: 0.25rem;
  color: #fff;
  border: 0.02rem solid #fff;
  border-radius: 0.4rem;
  padding: 0.1rem 0.2rem;
  text-align: center;
}
.change-icon {
  width: 0.3rem;
  vertical-align: sub;
}
.border-none::after {
  border: 0;
}
.default-text {
  padding: 0 0 0.35rem 0.35rem;
  font-size: 0.23rem;
  height: 0.697917rem;
}
.border-none {
  border: none;
}
.flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
.flex-item {
  width: 2.23rem;
  height: 1.28rem;
  margin-bottom: 0.2rem;
  margin-left: 0.2rem;
  background: #fff;
  border-radius: 0.1rem;
  position: relative;
}
.flex-item2 {
  width: 1.62rem;
  height: 1.1rem;
  background: #fff;
  margin-bottom: 0.2rem;
  margin-left: 0.2rem;
  border-radius: 0.1rem;
  position: relative;
  border: 0.01rem solid #e6e6e6;
}
.package-flow {
  font-size: 0.3rem;
  display: inline-block;
  padding-top: 0.25rem;
}
.package-flow2 {
  padding-top: 0.15rem;
  font-size: 0.3rem;
}
.package-price {
  color: #999999;
  margin-top: 0.15rem;
  font-size: 0.24rem;
}
.package-price2 {
  color: #999999;
  margin-top: 0.12rem;
  font-size: 0.24rem;
}
.list-icon {
  position: absolute;
  left: 0;
  top: 0;
  width: 0.4rem;
}
.list-icon > img {
  width: 100%;
}
.item-icon {
  vertical-align: middle;
  margin: 0.4rem 0;
  box-sizing: initial;
}
.checked {
  color: #fff !important;
  background-color: #41b5fe;
}
.checked2 {
  color: #fff !important;
  background-color: #ff2d55;
}
.bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 0.18rem 0 0.1rem 0.42rem;
  color: #000;
  font-size: 0.32rem;
  background-color: #fff;
}
.pink {
  color: #ff2d55;
  background: #fff;
}
.checkOrder {
  color: #fff;
  text-align: center;
  position: absolute;
  width: 2.48rem;
  right: 0;
  top: 0;
  bottom: 0;
  background: #ff2d55;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>