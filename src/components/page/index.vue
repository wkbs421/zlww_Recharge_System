<template>
    <div>
        <div class="nav">
            <img src="../../assets/sy_xc_img.png" alt="">
        </div>
        <yd-grids-group :rows="3" class="bg-f4">
            <yd-grids-item class="bg-white"  @click.native="setLink">
                <img slot="icon" src="../../assets/sy_jhllk_ic.png" class="item-icon">
                <span slot="text" class="item-text">激活流量卡</span>
            </yd-grids-item>
            <yd-grids-item class="bg-white"  @click.native="toLink('/addPackage?enter=0')">
                <img slot="icon" src="../../assets/sy-jjtc_ic.png" class="item-icon">
                <span slot="text" class="item-text">基础套餐</span>
            </yd-grids-item>
            <yd-grids-item class="bg-white" @click.native="toLink('/addPackage?enter=1')">
                <img slot="icon" src="../../assets/sy_lljyb_ic.png" class="item-icon">
                <span slot="text" class="item-text">流量加油包</span>
            </yd-grids-item>
            <yd-grids-item class="bg-white" @click.native="toLink('/flowSearch')">
                <img slot="icon" src="../../assets/sy_llcx_ic.png" class="item-icon">
                <span slot="text" class="item-text">流量查询</span>
            </yd-grids-item>
            <yd-grids-item class="bg-white" @click.native="toLink('/RechargeDetailed')">
                <img slot="icon" src="../../assets/sy_czmx_ic.png" class="item-icon">
                <span slot="text" class="item-text">充值明细</span>
            </yd-grids-item>
            <yd-grids-item class="bg-white" @click.native="toLink('/myCenter')">
                <img slot="icon" src="../../assets/sy_grzx_ic.png" class="item-icon">
                <span slot="text" class="item-text">个人中心</span>
            </yd-grids-item>
            <yd-grids-item class="bg-white" link="/declare">
                <img slot="icon" src="../../assets/sy_sysm_ic.png" class="item-icon">
                <span slot="text" class="item-text">使用说明</span>
            </yd-grids-item>
        </yd-grids-group>
        <div class="bottom">客服电话: 157-5931-6819</div>
    </div>
</template>
<script>
import utils from "../../utils/assist";
import api from "../../utils/httpClient.vue";
export default {
  mixins: [api],
  name: "index",
  data() {
    return {};
  },
  activated() {
    document.title = "全国流量卡营业厅";
  },
  created() {
    document.title = "全国流量卡营业厅";
    /* var userInfo = JSON.parse(unescape(utils.getCookie("userInfo")));
    var token = JSON.parse(unescape(utils.getCookie("token")));
    if (userInfo == null || token == null) {
      var code = this.$route.query.code;
      var state = this.$route.query.state;
      this.$store.commit("updateLoadingStatus", false);
      // if(code&&state){
      //     this.toLoading()
      // }
    } else {
      this.$store.commit("updateLoadingStatus", false);
    }

    pushHistory();
    window.addEventListener("popstate", function(e) {}, false);
    function pushHistory() {
      var state = {
        title: "title"
      };
    } */

    // debugger;
    // api.post('/test/sms/sendS ms',{mobile:'18050244157',sendType:1},(data)=>{
    //     debugger;
    //     console.log(data)
    // },(error)=>{
    //     debugger;
    //     console.log(error)
    // })
  },

  // activated(){
  //     this.$store.commit('updateLoadingStatus', false);
  // },
  methods: {
    // 微信登录
    // toLoading(){
    //     var params={
    //         code:this.$route.query.code,
    //         state:this.$route.query.state
    //     }
    //     this.get('/appLogin/loginByWeixinOauth',params,(data)=>{
    //     console.log(data)
    //     console.log(params)
    //     debugger;
    //     if(data.code=='0000'){
    //         utils.setCookie('userInfo',JSON.stringify(data.user),30);
    //         utils.setCookie('token',JSON.stringify(data.token),30);
    //     }else if(data.code=='0007'){

    //         utils.setCookie('userInfo',JSON.stringify(data.user),30);

    //     }
    // },(error)=>{
    // })

    // },
    toLink(link) {
      var token = JSON.parse(unescape(utils.getCookie("token")));
      debugger;
      if (token) {
        this.$router.push(link);
      } else {
        this.$dialog.confirm({
          title: "提示",
          mes: "您还没有注册，请您先注册",
          opts: () => {
            this.$router.push("/loginCenter");
          }
        });
        // this.$dialog.alert(
        //     {mes: '您还没有绑定的卡,请先进行绑定',
        //         callback: ()=>{
        //             this.$router.push('/activate')
        //         }
        //     }
        // );
      }
    },
    setLink() {
      var token = JSON.parse(unescape(utils.getCookie("token")));
      if (token) {
        this.$router.push("/addCard");
      } else {
        this.$dialog.confirm({
          title: "提示",
          mes: "您还没有注册，请您先注册",
          opts: () => {
            this.$router.push("/loginCenter");
          }
        });
      }
    }
  },
  computed: {}
};
</script>

<style scoped>
.nav {
  height: 2.43rem;
  background-color: #333;
  margin-bottom: 0.25rem;
}
.nav > img {
  width: 100%;
}
.item-icon {
  width: 0.6rem;
  height: auto;
  display: block;
}
.item-text {
  padding-top: 0.1rem;
  display: block;
}
.bottom {
  width: 100%;
  line-height: 0.8rem;
  position: fixed;
  bottom: 0;
  color: #666;
  text-align: center;
}
.bg-white {
  background-color: #fff;
}
</style>


