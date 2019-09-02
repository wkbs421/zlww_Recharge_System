<template>
    <div>
        <div class="bg">
            <div class="head">
            <p class="col"><span style="font-size:0.4rem;margin-right:0.2rem">¥</span><span class="money-text">{{orderInfo.realPrice}}</span></p>
            <p class="col2">付款金额</p>
            </div>
            <!-- 订单信息 -->
            <div class="orderInfo">
                <yd-cell-item>
                    <span slot="left" class="left-text">商品名称</span>
                    <span slot="left" class="color666 overfont">{{orderInfo.productName }}</span>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" class="left-text">充值卡号</span>
                    <span slot="left" class="color666 overfont">{{cardNum | formatCardNum}}</span>
                </yd-cell-item>
                <yd-cell-item>
                    <span slot="left" class="left-text">充值流量</span>
                    <span slot="left" class="color666 overfont">{{orderInfo.flowValue | formatFlow}}</span>
                </yd-cell-item>
                <!-- <yd-cell-item class="top">
                    <div slot="left" class="overfont ordermsg">
                        <div  class="left-text inblock" style="float:left">详细说明</div>
                        <div  class="overfont3 color666 inblock" >流量基础套餐，可叠加，当月生效，每月3G，按月到账，结算日期为每月26日</div>
                    </div>
                </yd-cell-item> -->
            </div>
        </div>
        <!-- 确认按钮 -->
        <div style="margin:0 0.4rem">
            <yd-button size="large" shape="circle" bgcolor="#ff2d55" color="#fff" @click.native="getWxpayApi">确认付款</yd-button>
        </div>
    </div>
</template>

<script>
import utils from '../../../utils/assist'
import api from '../../../utils/httpClient.vue'
    export default {
        mixins: [api],
        name:'checkOrder',
        data () {
            return {
               orderInfo:this.$route.params.orderInfo,
               cardNum:this.$route.params.cardNum,
               params:{}
            }
        },
        created () {
            this.$store.commit('updateLoadingStatus', false);
            document.title="确认订单"
            console.log(this.$route.params)
            if(!this.$route.params.orderInfo){
                this.$router.replace('/addPackage')
            }

            
        },
        methods: {
            // 微信支付Api
            getWxpayApi(){
                var params = {
                    iccid:this.cardNum,
                    productid:this.orderInfo.feePlanId||this.orderInfo.flowPackageId,
                    businesstype:this.orderInfo.businesstype,
                    openId:JSON.parse(unescape(utils.getCookie("wxInfo"))).openId,
                }
                debugger;
                this.post('/pay/createorder',params,(data)=>{
                    debugger;
                    this.params = data.payparam
                    // if(data.code=="0000"){
                        if (typeof WeixinJSBridge == "undefined"){
                            if( document.addEventListener ){
                                document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
                            }else if (document.attachEvent){
                                document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
                                document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
                            }
                            
                        }else{
                        this.onBridgeReady();
                        }
                    // }
                },(error)=>{
                })
            },
            // 微信支付回调
            onBridgeReady(){
                var params = this.params
                console.log(params)
                debugger
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId":params.appId,     //公众号名称，由商户传入     
                        "timeStamp":params.timeStamp,         //时间戳，自1970年以来的秒数     
                        "nonceStr":params.nonceStr, //随机串     
                        "package":params.package,     
                        "signType":"MD5",         //微信签名方式：     
                        "paySign":params.paySign //微信签名 
                    },
                    (res)=>{     
                        console.log(res)
                        if(res.err_msg == "get_brand_wcpay_request:ok" ) {
                            this.$router.replace('/flowSearch')
                        }     // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。 
                    }
                ); 
                debugger;
        }
            
        },
        filters: {
            // 格式化卡号
            formatCardNum(CardNum){
                var CardNum = CardNum.split(/(\w{4})/)
                CardNum = CardNum.filter((ele,i)=>{
                    return (!(ele === ''))
                })
                CardNum = CardNum.join('-')
                return CardNum
            },
            // 格式化流量单位
            formatFlow(flowNum){
                if(flowNum >=1024){
                    return (flowNum/1024).toFixed(2) +'G'
                }else{
                    return flowNum + 'M'
                }
            }
        }   
    }
</script>

<style scoped>
.bg{
    background: #fff;
    padding: 0 0.3rem;
}
.money-info{   
    text-align: center;
}
.money-text{
    font-size: 0.8rem;
}
.head{
    text-align: center;
    border-bottom: .01rem solid #e6e6e6;    
}
.col{
    padding: .58rem 0 .25rem 0;
}
.col2{
    padding-bottom:.4rem;
    font-size: 0.28rem; 
    color:#c3c3c3;
}
.orderInfo{
    color:#7f7f7f;
    font-size: 0.3rem;
    padding-bottom: 0.5rem;
}
.orderInfo>p{
    margin-top: 0.3rem;
}
.orderInfo>div>div{
    display: inline-block;
    float: left;
}
.inblock{
    display: inline-block;
}
.orderInfo>p>div{
    margin-right:.1rem
}
.left-text{
    color:#999999;
    padding-right: 0.2rem;
}
.yd-cell-item:not(:last-child):after{
    border: 0;
}
.overfont3{
    word-break:break-all;
    overflow: hidden;
    display: inline-block;
    text-overflow:ellipsis;
    /* width: 5.5rem; */
    white-space:normal;
    /* margin-top: 0.35rem */
    margin-right: 0.3rem;
    line-height: 0.4rem;
    padding-right:1.2rem; 
    max-height: 1.2rem;
}
.yd-cell-item{
    padding: 0
}
.color666{
    color: #666;
}
.ordermsg{
    text-overflow:ellipsis;
}
</style>