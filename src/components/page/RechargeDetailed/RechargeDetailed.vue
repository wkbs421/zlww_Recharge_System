<template>
    <div>
        <!-- 头部 -->
        <div class="head">
            <yd-cell-item class="border-none">
                <span slot="left" class="left-text white">{{cardNum | formatCardNum}}</span>
                <span slot="right" class="change"  @click="showPop"><img src="../../../assets/qh_ic.png" alt="" class="change-icon">切换</span>
            </yd-cell-item>
            <div class="default-text white"><span v-if="isDefaultNumcard">默认 </span> 充值卡号 (ICCID)</div>
        </div>
        <!-- 充值详情列表 -->
        <div v-for="(item2,a) in detailList" :key="a" class="detail-list" v-if="item2.detail.length>0">
            <div class="detail-head">
                <p class="alltime">{{item2.year+'年'+item2.month+'月'}}</p>
                <p class="total">{{'充值 ¥ '+item2.totleFee}}</p>
            </div>
            <div class="list">
                <!-- 详情行 -->
            <yd-cell-item v-for="(item,i) in item2.detail" :key="i">
                <img :src="setRechargeIcon(item.businessType)" slot="icon" class="list-icon">
                <span slot="left" style="font-size:0.35rem;color:#333">
                    <span>{{item.postageName}}</span></br>
                    <span class="time">{{item.rechargeTime}}</span>
                </span>
                <span slot="right" style="color:#666666;text-align:center">
                    <span style="font-size:0.35rem">{{'￥'+item.price}}</span></br>
                    <span style="color:#ababab;font-size:0.2rem">{{item.payType}}</span>
                </span>
            </yd-cell-item>
            </div>
            
        </div>
        <!-- v-if="detailList.length===0" -->
        <div class="empty" v-if="isEmpty">
            <span>暂无充值记录~</span>
        </div>
        <!-- 切换卡弹窗 -->
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
// 导入图标
import refuelImg from "../../../assets/mx_jcb_ic.png";
import mealImg from "../../../assets/mx_jyb_ic.png";
import utils from "../../../utils/assist";
import api from "../../../utils/httpClient.vue";
import store from '../../../utils/store'
export default {
  mixins: [api],
  name: "RechargeDetailed",
  data() {
    return {
      icon: {
        // 套餐图标
        refuelImg,
        // 加油包图标
        mealImg
      },
      // 弹窗状态
      show1: false,
      // 弹窗显示数据
      slots: [
        {
          flex: 1,
          values: [
          ],
          className: "slot1",
          textAlign: "center"
        }
      ],

      detailList: "",

      // 卡号
      defaultCardNum: "",
      // 弹窗中选中的卡号
      cardNum: ""
    };
  },
  created() {
    this.getUserCardList();

    document.title = "充值明细";
  },
  methods: {
    // 弹窗中选中值
    //获取iccid列表接口
    getUserCardList() {
      this.get(
        "/user/iccidlist",
        "",
        data => {
          console.log(data + "888888888888888888");
          if (data.code == "0000") {
            if(data.cardlist.length==0){
                this.$dialog.alert(
                    {mes: '您还没有绑定的卡,请先进行绑定',
                      callback: ()=>{
                          this.$router.push('/addCard')
                      }
                    }
                );
            }else{                    
            var cardArr = data.cardlist.map(element => {
              if (element.isdefault === "1") {
                this.defaultCardNum = element.ICCID;
              }
              return element.ICCID;
            });
            console.log(cardArr);
            // 如果路由有传卡号,则使用传过来的卡号
            if(this.$route.params.cardNum){
              this.cardNum = this.$route.params.cardNum
            }else{
              // 如果有默认卡则显示默认卡,如没有则显示第一张卡
                if (this.defaultCardNum) {
                this.cardNum = this.defaultCardNum;
              } else {
                this.cardNum = cardArr[0];
              }
            }
            //调起列表接口
            this.getdetailList();
            this.slots[0].values = cardArr;
            /*this.getFeeplanlistApi();
            this.getFlowpackagelistApi();*/
          }
          }
        },
        error => {}
      );
    },
    onValuesChange(picker, values) {
      this.checkedCarNum = values[0];
    },

    getdetailList() {
       store.commit('updateLoadingStatus', true);
      var params = { iccid: this.cardNum };
      this.get(
        "api/detail/getdetail",
        params,
        data => {
          store.commit('updateLoadingStatus', false);
          if (data.code == "0000") {
            this.detailList = data.rechargeDetail;
            console.log(555555555555555)
            console.log(this.detailList);
          }
        },
        error => {}
      );
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
        console.log('88888888888888888888888888888')
      this.cancelPop();
      if(this.cardNum==this.checkedCarNum){
          return
      }else{
        this.cardNum = this.checkedCarNum;
        this.getdetailList()
      }
    },
    setRechargeIcon(state){
      return state?this.icon.refuelImg:this.icon.mealImg
    },
  },

  computed:{
      isDefaultNumcard(){
          return  this.cardNum == this.defaultCardNum ? true:false
      },
      // 判断是否有充值记录
      isEmpty(){
        var isEmpty = true
        if(!(this.detailList==='')){
            this.detailList.forEach((ele,i)=>{
            if(ele.detail.length>0){
              isEmpty = false
            }
          })
        }else{
          isEmpty = false
        }
        console.log(isEmpty)
        return isEmpty
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
  }
};
</script>

<style scoped>
.head {
  background-color: #ff2d55;
}
.left-text {
  font-size: 0.35rem;
}
.white {
  color: #fff;
}
.black {
  color: #333;
}
.change {
  font-size: 0.25rem;
  color: #fff;
  border: 0.02rem solid #fff;
  border-radius: 0.4rem;
  padding: 0.1rem 0.2rem;
  text-align: center;
}
.border-none::after {
  border: 0;
}
.default-text {
  margin-top: -0.2rem;
  padding: 0 0 0.2rem 0.35rem;
  font-size: 0.3rem;
}
.detail-head {
  padding: 0.25rem 0 0 0.35rem;
}
.alltime {
  color: #000;
  font-size: 0.32rem;
  font-weight: 600;
}
.total {
  color: #868686;
  font-size: 0.28rem;
  padding-bottom: 0.1rem;
}
.list {
  background-color: #fff;
}
.list-icon {
  width: 0.8rem;
  height: 0.8rem;
  padding: 0.3rem 0.15rem 0.3rem 0;
  box-sizing: initial;
}
.time {
  font-size: 0.25rem;
  color: #c9c9c9;
}
.change-icon {
  width: 0.3rem;
  vertical-align: sub;
}
.detail-list .yd-cell-item:not(:last-child):after {
  border-bottom: 0.01rem solid #ededed;
}
.empty{
    /* background-color: #fff; */
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.35rem;
    color:lightgrey;
}
</style>