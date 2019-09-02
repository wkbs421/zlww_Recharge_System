<template>
    <div>
        <!-- 头部 -->
        <div class="head">
            <yd-cell-item>
                <img slot="icon" src="../../../assets/tytx_ic.png" class="head-icon">
                <div slot="left" class="head-info">
                    <p class="name">{{nickName}}</p>
                    <p style="padding-top:0.1rem;font-size:0.3rem">{{mobile | setMobileEncrypted}}</p>
                </div>
                <div slot="right" class="backButton">
                    <yd-button type="primary" style="background: white; color: #ff2d55;"  @click.native="backLoginButton">退出</yd-button>
                </div>
            </yd-cell-item>
        </div>
        <!-- 个人拥有卡明细 -->
        <div>
            <yd-cell-group  class="myCenter-item">
                <yd-cell-item>
                    <span slot="left" style="font-size:0.36rem;color:#333;padding:0.2rem 0">我的物联网卡</span>
                    <span slot="right" style="color:#ff2d55;margin-right:0.2rem"><img src="../../../assets/tjwlwk_ic.png" alt="" class="tj-icon">
                        <router-link to="/addCard">添加</router-link>
                    </span>
                </yd-cell-item>
                <!-- <yd-cell-item class="border-none">
                        <span slot="left" style="color:#9d9d9d"  class="item-padding">8899-2222-2323-3322-357s</span>
                        <yd-button  shape="circle" slot="right" class="addCar">默认显示</yd-button>
                </yd-cell-item> -->
                <yd-cell-item v-for="(item,i) in cardList" :key="i" class="border-none">
                        <span slot="left" style="color:#9d9d9d" class="item-padding">{{item.ICCID | formatCardNum}}</span>
                        <yd-button  shape="circle" slot="right" class="addCar" v-if="item.isdefault==='1'">默认显示</yd-button>
                        <span slot="right" style="color:#9d9d9d" class="setDefault" v-else="item.isdefault==='0'" @click="setDefaultCard(item.ICCID,i)"><i></i>设为默认</span>
                </yd-cell-item>
            </yd-cell-group>
            <div class="empty" v-if="cardList.length==0">
                <span>您还没有绑定的卡~</span>
            </div>
        </div>
    </div>
</template>

<script>
import utils from '../../../utils/assist'
import api from '../../../utils/httpClient.vue'
    export default {
        mixins: [api],
        name:'myCenter',
        data () {
            return {
                nickName:'',
                mobile:JSON.parse(unescape((utils.getCookie('userInfo')))).mobile,
                cardList:""
            }
        },
        created () {
            document.title="个人中心"
            if(JSON.parse(unescape((utils.getCookie('userInfo')))).nickName == null){
                this.nickName = "未绑定微信";
            }else{
                this.nickName = JSON.parse(unescape((utils.getCookie('userInfo')))).nickName;
            }
            this.getUserCardList()
        },
        methods: {

            // 退出登录
        backLoginButton(){
            utils.delCookie('token');
            utils.delCookie('userInfo');
            
            this.$router.replace({path:'/loginCenter',query:{isBack:'0'}});
        },
          // 获取用户绑定的ICCID列表
            getUserCardList(){
                this.get('/user/iccidlist','',(data)=>{
                        if(data.code=="0000"){
                            this.cardList = data.cardlist
                        }
                    },(error)=>{
                })
            },
            // 设置默认卡
            setDefaultCard(iccid,index){
                var params = {iccid}
                this.post('/user/setdefault',params,(data)=>{
                        if(data.code=="0000"){
                            for (const i in this.cardList) {
                                if (this.cardList.hasOwnProperty(i)) {
                                    this.cardList[i]['isdefault'] = "0"
                                }
                            }
                            this.cardList[index]['isdefault'] = "1"
                            this.$dialog.toast({
                                mes: '设置成功',
                                timeout: 1500
                            });
                        }
                    },(error)=>{
                })
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
            // 手机号加密
            setMobileEncrypted(tel){
               var reg = /^(\d{3})\d{4}(\d{4})$/;
               return tel.replace(reg, "$1****$2");
            }
        },
           
    }
</script>

<style scoped>

.head{
    margin-bottom: .1rem;
    color:#fff;
    background:#ff2d55
}
.head-icon{
    width: 1.02rem;
    height: 1.02rem;
    box-sizing:initial;
    padding: 0.2rem;
    border-radius: 50%;
    border: .02rem solid #ff2d55;
}
.head-info{
    color: #fff;
}
.addCar{
    background: #ff2d55;
    color:#fff;
}
.border-none::after{
    border: none;
}
.item-padding{
    padding: 0.2rem 0;
    font-size: 0.3rem;
}
.name{
    font-size: .4rem;
}
.setDefault{
    width: 1.3rem;
    text-align: center;
}
.tj-icon{
    width: 0.3rem;
    vertical-align:text-bottom;
}
.empty{
    background-color: #fff;
    height: 1rem;
    line-height: 1rem;
    text-align: center;
    font-size: 0.35rem;
    color:lightgrey;
}
.backButton{
    margin-right: 0.6rem;
    color: #ff2d55;
    font-size: 0.5rem;
}
</style>