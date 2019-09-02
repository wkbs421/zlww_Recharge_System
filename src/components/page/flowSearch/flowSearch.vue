<template>
    <div>
        <!-- 头部 -->
        <yd-cell-item style="background:#f40532" class="none-border">
            <div slot="left">
                <span class="left-text">当前卡号:</span>
                <span class="card-num">{{cardNum | formatCardNum}}</span>
            </div>
            <div slot="right" class="right" @click="showPop">
                <img src="../../../assets/qh_ic.png" alt="" class="change-icon" >
                切换
            </div>
        </yd-cell-item>
        <!-- 流量信息 -->
        <div class="flow-msg">
            <div class="progressBar-Box">
                <div class="progressBar">
                    <yd-progressbar
                    trail-width="4"
                    stroke-width="4"
                    stroke-color="rgba(248,248,255,0.2)"
                    trail-color="#fff"
                    :progress="getFlowprogress"
                    >
                    <p class="flow-num"><span>{{overstepFlow | formatFlow}}</span><span class="flow-dec">M</span> </p>
                    <p class="flow-text">本月{{residueFlowState}}</p>
                    </yd-progressbar>
                </div>
            <yd-grids-group :rows="3">
                <yd-grids-item class="flow-item">
                    <div slot="text">   
                        <p class="flow-num flow-text" style="color:#eac0c8">本月总流量</p>
                        <p class="flow-text flow-bottom">{{availableflow | formatFlow}}M</p>
                    </div>
                </yd-grids-item>
                <yd-grids-item class="flow-item">
                    <div slot="text">
                        <p class="flow-num flow-text" style="color:#eac0c8">本月已用</p>
                        <p class="flow-text flow-bottom">{{usedflow | formatFlow}}M</p>
                        <div class="split"></div>
                    </div>
                </yd-grids-item>
                <yd-grids-item class="flow-item">
                    <div slot="text">
                        <p class="flow-num flow-text" style="color:#eac0c8">本月剩余</p>
                        <p class="flow-text flow-bottom">{{surplusFlow | formatFlow}}M</p>
                    </div>
                </yd-grids-item>
            </yd-grids-group>
        </div>
        </div>
        <!-- 物联网卡套餐信息 -->
        <div class="packageBox">
        <div style="background:#fff">
            <yd-cell-item>
                <span slot="left"  class="item">
                    <span class="left-text black">卡状态:</span>
                    <span class="green" v-if="cardStatus =='1'"><yd-icon name="checkoff" size="0.2rem" style="margin-right:0.1rem"></yd-icon>正常</span>
                    <span class="red" v-else><yd-icon name="warn" size="0.2rem" style="margin-right:0.1rem"></yd-icon>{{cardStatus | cardState}}</span>
                </span>
                <div slot="right" class="right pink">
                    <router-link :to="{name:'RechargeDetailed',params:{cardNum}}">
                        充值明细
                    </router-link>
                </div>
            </yd-cell-item>
            <template  v-for="(item,i) in packageList">
            <yd-cell-item  v-if="i==0">
                <span slot="left" class="item">
                    <span class="left-text black left-title" style="float:left;line-height:0.4rem">卡套餐:</span>
                    <div class="packageInfo" style="line-height:0.4rem">
                        <p>{{item.postageName}}</p>
                        <p class="packageInfo-bottom">有效期至 : {{item.invalidTime}}</p>
                    </div>
                </span>
            </yd-cell-item>
            <yd-cell-item v-else>
                <span slot="left" class="item">
                    <span class="left-text black left-title" style="float:left"></span>
                    <div class="packageInfo">
                        <p style="line-height:0.4rem">{{item.postageName}}</p>
                        <p class="packageInfo-bottom" style="line-height:0.4rem">有效期至 : {{item.invalidTime}}</p>
                    </div>
                </span>
            </yd-cell-item>
            </template>
        </div>
        </div>
        <!-- 底部 -->
        <div class="bottom">
            <div style="margin: 0.35rem 0.3rem 0.2rem">
                <router-link :to="{name:'addPackage',params:{cardNum}}">
                    <yd-button size="large" shape="circle" style="background:#ff2d55">去充值</yd-button>
                </router-link>
            </div>
            <!-- 以上数据均采集自中国联通服务器
            <span class="yhxz">《用户须知》</span> -->
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
import utils from '../../../utils/assist'
import api from '../../../utils/httpClient.vue'
    export default {
        mixins: [api],
        name:'flowSearch',
        data () {
            return {
                // 弹窗状态
                show1:false,
                // 弹窗显示数据
                slots: [
                    {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                    }
                ],
                // 选择卡号
                cardNum:"",
                // 弹窗中选中的卡号
                checkedCarNum:'',
                // 默认卡号
                defaultCardNum:"",
                // 套餐列表
                packageList: '',
                // 已使用流量
                usedflow:0,
                // 总流量
                availableflow:0,
                // 卡状态
                cardStatus:'1',
                start1:false
            }
        },
        components: {
            
        },
        created () {
            document.title="流量查询"
            this.getUserCardList()
        },
        methods: {
            // 弹窗中选中值
            onValuesChange(picker, values) {
                this.checkedCarNum = values[0]
            },
            // 取消弹窗
            cancelPop(){
                this.show1 = false;
            },
            // 显示弹窗
            showPop(){
                this.show1 = true
            },
            // 弹窗确认
            confirmPop(){
                this.cancelPop();
                if(this.cardNum==this.checkedCarNum){
                    return
                }else{
                    this.cardNum = this.checkedCarNum
                    this.getSearchflowApi()
                }
            },
            // 获取用户绑定的ICCID列表
            getUserCardList(){
                this.get('/user/iccidlist','',(data)=>{
                        if(data.code=="0000"){
                            debugger;
                            // 如果没有卡则引导到绑卡界面
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
                                if(element.isdefault === '1'){
                                    this.defaultCardNum = element.ICCID
                                }
                                return element.ICCID
                            });
                        // 如果有默认卡则显示默认卡,如没有则显示第一张卡
                        if(this.defaultCardNum){
                            this.cardNum = this.defaultCardNum
                        }else{
                            this.cardNum = cardArr[0]
                        }
                        this.slots[0].values = cardArr
                        this.getSearchflowApi()
                        }
                        }
                    },(error)=>{
                })
            },
            //获取流量信息API
            getSearchflowApi(){
                debugger;
                var params = {iccid:this.cardNum}
                this.get('/user/searchflow',params,(data)=>{
                    console.log(5555555555)
                    console.log(data)
                    debugger;
                        if(data.code=="0000"){
                            this.packageList = data.packageList
                            this.usedflow = data.usedflow
                            this.availableflow = data.availableflow
                            this.cardStatus = data.cardStatus
                            this.start1 = true;
                        }
                    },(error)=>{
                })
            }
        },
        computed: {
            // 本月剩余流量
            surplusFlow(){
                var result = this.availableflow - this.usedflow
                if(result>=0){
                    return result
                }else{
                    return 0
                }
            },
            // 超出流量
            overstepFlow(){
               var result = this.availableflow - this.usedflow
               return Math.abs(result)
            },
            // 已用流量进度条百分比
            getFlowprogress(){
                if(this.usedflow>this.availableflow){
                    return 1
                }else if(this.availableflow===0||this.availableflow===null){
                    return 0
                }else{
                    console.log(Number(this.usedflow/this.availableflow).toFixed(2))
                    return Number(this.usedflow/this.availableflow).toFixed(2)
                }
            },
            // 是否超出流量显示
            residueFlowState(){
                var result = this.availableflow - this.usedflow
                if(result>=0){
                    return "剩余"
                }else{
                    return "超出"
                }
            },
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
            //流量格式化 
            formatFlow(flow){
                return Number(flow).toFixed(2)
            },
            
            // 卡状态
            cardState(state){
                switch(state){
                    case '0':
                    return "未激活"
                    case '2':
                    return "已停机"
                    case '3':
                    return "已注销"
                    default:
                    return "状态异常"
                }
            }
        }     
    }
</script>

<style scoped>
.left-text{
    font-size: .3rem;
    font-weight: 600;
    color: #fff;
    margin-right: .1rem;
}
.left-title{
    display: inline-block;
    width: 1rem;
    height: 0.5rem;
}
.none-border::after{
    border-bottom:0
}
.item{
    padding: 0.2rem 0;
}
.black{
    color:black;
}
.pink{
    color:#ff2d55!important;
    border: .01rem solid #ff2d55!important;
}
.green{
    color:#09bb07;
}
.red{
    color:red;
}
.card-num{
    color: #fff;
}
.right{
    font-size: .25rem;
    color: #fff;
    border: .02rem solid #fff;
    border-radius: .4rem;
    padding: .1rem 0.2rem;
    text-align: center;
}
.flow-msg{
    background-color: #ff2d55;
    margin-bottom: .17rem;
}
.progressBar-Box{
    padding-top: .35rem;
}
.progressBar{
    width: 2.55rem;
    height: 2.55rem;
    margin: 0 auto;
}
.flow-num{
    font-size: 0.45rem;
    color:#fff;
    font-weight: 600;
}
.flow-dec{
    font-size: 0.25rem;
}
.flow-text{
    font-size: 0.28rem;
    color: #fff;
    text-align: center;
}
.flow-bottom{
    margin-top: .1rem;
}
/* .yd-cell-item:not(:last-child):after{
    border-bottom: 0
} */
.flow-item{
    background-color: #ff2d55;
    position: relative;
    height: 1.5rem;
}
.split{
    width: 2.2rem;
    height: .32rem;
    position: absolute;
    top: 0.6rem;
    border-left: .01rem solid #ff7554;
    border-right: .01rem solid #ff7554;
}
.packageInfo{
    font-size: 0.3rem;
    display: inline-block;
    /* vertical-align:baseline */
}
.packageInfo-bottom{
    font-size: 0.25rem;
    color:#999;
    margin-top: .1rem;
}
.change-icon{
    width: .3rem;
    vertical-align:sub;
}
.bottom{
    color:#999;
    text-align: center;
    position: fixed;
    bottom: 0.2rem;
    left: 0;
    right:0;
}
.yhxz{
    padding-left: 0.1rem;
    color:#7989ab;
}
.packageBox{
    /* min-height: 3.8rem; */
    max-height: 3.6rem;
    overflow-y:auto ;
}
.border{
    border-bottom: .01rem solid #efefef
}
.border::after{
    border: 0
}
.yd-grids-3 .yd-grids-item:not(:nth-child(3n)):before{
    border-right:0;
}
.yd-grids-item:after{
    border: 0;
}
.yd-grids-3:before{
    border-bottom: 0;
}
</style>