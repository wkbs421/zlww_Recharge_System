<template>
  <div style="padding:0.25rem 0.3rem 1.23rem">
    <div class="text-box">
      <div class="title">用户须知</div>
      <div class="content" v-for="(item,i) in userKnows">{{item}}</div>
    </div>
    <div class="text-box">
      <div class="title">使用说明</div>
      <div class="content">部分手机插卡后设置默认的数据卡为流量卡即可上网；</div>
      <div class="content">通过手机浏览器检测若无法上网，安卓手机请按照以下步骤设置，<a href="#ios" style="color:#3bb4f2">苹果用户点击这里。</a></div>
    </div>
    <div class="text-box">
      <div class="title">一、安卓用户</div>
      <div style="color:#000">1.手机配置先完成 ---2.去微信公众号”激活流量卡“ 操作---3.建议重启手机</div>
      <template v-for="(item,i) in android">
        <div class="pink">{{item.text}}</div>
        <img :src="item.imgUrl" alt="" :style="setWidth(i)">
      </template>
    </div>
    <div class="text-box">
      <div class="title">二、安卓其他机型APN设置</div>
      <template v-for="(item,i) in android5">
        <div class="android5pp"></div>
        <img :src="item.imgUrl" alt="" :style="setWidth(i)">
      </template>
    </div>
    <div class="text-box" id="ios">
      <div class="title">三、苹果用户（除电信定制机外）</div>
      <div class="content" v-for="(item,i) in ios">{{item}}</div>
    </div>
  </div>
</template>

<script>
  import pic1 from '../../../../src/assets/a_img.png'
  import pic2 from '../../../../src/assets/b_img.png'
  import pic3 from '../../../../src/assets/c_img.png'
  import pic4 from '../../../../src/assets/d_img.png'
  import pic5 from '../../../../src/assets/sygz_1_img.png'
  import pic6 from '../../../../src/assets/sygz_2_img.png'
  export default {
    name:'declare',
    data(){
      return{
        userKnows:[
          "1、一张流量卡对应一个设备（卡槽）使用，一旦流量卡插入设备，则不允许更换设备或卡槽否则会被锁导致无法上网。",
          "2、流量卡充值前必须先进行绑定，成功绑定后可在微信公众号中充值。",
          "3、流量充值生效期：套餐购买后立即生效（可能有1-2分钟延迟），结算日期为每月26日24时。",
          "4、流量卡使用区域：当前仅限中国大陆境内使用。",
          "5、请确保您的智能设备支持，中国联通3G/4G网络。"
        ],
        android:[
          {text:"a、选择用于数据网络的SIM卡",imgUrl:pic1},
          {text:"b、打开数据漫游服务",imgUrl:pic2},
          {text:"c、打开移动数据网络，其他快捷操作也行",imgUrl:pic3},
          {text:"d、微信公众号激活流量卡",imgUrl:pic4}
        ],
        android5:[
          {imgUrl:pic5},
          {imgUrl:pic6}
        ],
        ios:[
          "1、将激活后的流量卡放入卡槽——蜂窝移动网络——蜂窝移动数据选项——语音与数据（LTE）（注：苹果手机绑定后插卡即可使用3G网络，可将3G网络改为4G（LTE）网络）",
          "2、ios若无网络请进行一下设置：设置——蜂窝移动网络——蜂窝移动数据网络——APN：UNIM2M.NJM2MAPN"
        ]
      }
    },
    activated(){
            document.title="使用说明"
        },
    created () {
      document.title="使用说明"
      this.$store.commit('updateLoadingStatus', false);
    },
    methods: {
      setWidth(i){
        if(i==3){
          return {width:"50%"}
        }else{
          return {width:"100%"}
        }
      }
    }
  }
</script>

<style scoped>
  .title{
    color: #333;
    font-size: 0.36rem;
    font-weight: 600;
  }
  .content{
    color:#999;
    font-size: .33rem;
    padding: 0.2rem 0 0.1rem 0;
  }
  .text-box{
    padding-bottom: 0.5rem
  }
  .pink{
    color:#ff2d55;
    font-weight:600;
    font-size: 0.33rem;
    padding: 0.3rem 0;
  }
  .android5pp{
    width: 100%;
    height: 0.2rem;
  }
</style>