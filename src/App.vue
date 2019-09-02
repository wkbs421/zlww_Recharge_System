<template>
  <div id="app">
    <input v-model="isLoading" v-show="false"></input>
    <keep-alive include="index,declare">
    <router-view />
    </keep-alive>
  </div>
</template>

<script>
// 导入utils文件
import utils from './utils/assist'
import api from './utils/httpClient.vue'
export default {
  name: 'app',
  mixins: [api],
  data () {
    return {
      load:'',
      beginTime:'',
      endTime:''
    }
  },
  created () {

    // this.tocheckToken()
    // utils.delCookie('userInfo')
    // utils.delCookie('token')
  },
  methods: {
        // 验证token是否失效
    tocheckToken(){
        var token=JSON.parse(unescape((utils.getCookie('token'))));
        if(token){
        this.get('/user/iccidlist',"",(data)=>{
        console.log(data)
        console.log(params)
        debugger;
        if(data.code=='1011'){
            utils.delCookie('token')
            utils.delCookie('userInfo')
            this.$router.push("/login")
          }
      },(error)=>{
      })
      }
    }
  },
  computed: {
    isLoading() {
        this.load = this.$store.state.isLoading
        return this.$store.state.isLoading
    }
  },
  watch: {
    load(cur){
      if(cur){
        this.$dialog.loading.open()
        this.beginTime = new Date().getTime()
      }else{
        this.endTime = new Date().getTime()
        var time = this.endTime - this.beginTime
        time = time>=300?0:300 - time
        setTimeout(() => {
          this.$dialog.loading.close()
        }, time);
      }
    }
  },
}
</script> 

<style>
#app{
  background-color: #f4f4f4;
}
.bg-f4>.yd-grids-3{
    background-color:#f4f4f4!important;
}
.bg-f4>.yd-grids-3::before{
    border-bottom: 0
}
.myCenter-item>.yd-cell::after{
    border: 0;
}
</style>
