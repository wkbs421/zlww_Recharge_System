<template>
    <div>
    </div>
</template>

<script>
// 请求方法
import utils from '../../../utils/assist'
import api from '../../../utils/httpClient.vue'
    export default {
        mixins: [api],
        name:'login',
        created () {
            /* if(!this.$route.query.code || !this.$route.query.state){
               this.login();
            }else{
               this.toLoading();
            } */
        },
        methods: {
            login(){
                this.get('/appLogin/getweixinParam','',(data)=>{
                    if(data.code=='0000'){
                    var state =data.param.state;
                    window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid='+data.param.appId+'&redirect_uri='+encodeURIComponent(data.param.redirectUri)+'&response_type=code&scope='+data.param.scope+'&state='+state+'#wechat_redirect';
                    }
                },(error)=>{
                })
            },
            toLoading(){
                var params={
                    code:this.$route.query.code,
                    state:this.$route.query.state
                }
                this.get('/appLogin/loginByWeixinOauth',params,(data)=>{
                if(data.code=='0000'){
                    utils.setCookie('userInfo',JSON.stringify(data.user),30);
                    utils.setCookie('token',JSON.stringify(data.token),30);
                    utils.setCookie('wxInfo',JSON.stringify(data.wxInfo),30);
                    this.$router.replace('/index')

                }else if(data.code=='0007'){
                    utils.setCookie('userInfo',JSON.stringify(data.user),30);
                    utils.setCookie('wxInfo',JSON.stringify(data.wxInfo),30);
                    this.$router.replace('/index')

                }
            },(error)=>{
            })


            },
        }
    }
</script>

<style scoped>

</style>
