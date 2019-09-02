<template>
  <div>
    <div class="topView">
      <p style="margin-left: 1rem;font-size: .5rem;padding-top: .6rem;font-weight: bold">流量卡使用说明</p>
    </div>
    <div class="firstView">
      <p class="redStr" style="padding-left: 0.5rem;padding-top: .3rem">
        !!!请先确认您的设备可以使用联通4G网络
      </p>
      <div style="margin-left: 0.5rem;font-size: .4rem;font-weight: bold;padding-top: 0.2rem;padding-bottom: 0.6rem">
        第一步：将流量卡插入手机，并设置接入点（APN）
      </div>
      <div class="clickView">
        <span class="redStr" style="margin-top: 1em;">
          部分手机插卡后设置默认数据卡位流量卡即可上网，通过手机浏览器检测后若无法上网，安卓手机请按照一下不走设置，
        </span>
        <!--<router-link to ="/liActivate" style="color: blue;font-size: .3rem"><a>苹果用户点击这里</a></router-link>-->
        <span v-on:click="appleUserClick" style="color: blue;font-size: .3rem">苹果用户点击这里</span>
      </div>
      <div class="firstStep" style="font-size: .3rem;" v-for="(inforView,a) in inforArr" :key="a" >
        <div style="margin-left: .5rem">{{inforView.tittleStr}}</div>
        <div style="text-align: center">
          <img style="width: 5rem;height: 6rem" :src="inforView.imgurl"/>
        </div>
      </div>
    </div>
    <div style="margin-left: .5rem;font-size: .3rem">6.选择使用刚刚创建的APN即可</div>

    <div style="margin-left: 0.5rem;font-size: .4rem;font-weight: bold;padding-top: 0.1rem;padding-top: 0.8rem;padding-bottom: 0.6rem">苹果用户(非电信定制苹果手机)</div>

    <div style="margin-left: .5rem;font-size: .3rem;">
      <div>将激活后的流量卡放入卡槽——蜂窝移动网络——蜂窝移动数据选项——语音与数据(LTE)</div>
      <div class="redStr">注：苹果手机绑定后插卡即可使用3G网络，可将3G网络改为4G（LTE）网络</div>
      <div>ios若无网络请进行以下设置:</div>
      <div>设置——蜂窝移动网络——蜂窝移动数据网络——APN：UNIM2M.NJM2MAPN</div>
    </div>

    <div style="margin-left: .5rem;font-size: .4rem;font-weight: bold; padding-top: .4rem;padding-bottom: .4rem">备注</div>

    <ul class="redStr" style="margin-left: .5rem">
      <li>1.流量卡更换卡槽.更换设备都会被锁，导致无法上网</li>
      <li>2.手机需要支持中国联通4G/3G网络</li>
      <li>3.接入点（APN）设置：</li>
      <li>名称：UNIM2M.NJM2MAPN</li>
      <li>APN：UNIM2M.NJM2MAPN</li>
    </ul>

  </div>
</template>



<script>
  import pic1 from '../../../../src/assets/logo.png'
  export default {
    data(){
      return{
        inforArr:[
          {
            tittleStr:'1.打开设置，选择【选择蜂窝移动数据】',
            imgurl:pic1,
          },
          {
            tittleStr:'2.选择【高级设置】',
            imgurl:pic1,
          },
          {
            tittleStr:'3.选择流量卡对应的【接入点设置】',
            imgurl:pic1,
          },
          {
            tittleStr:'4.点击【新建APN】，创建新的接入点',
            imgurl:pic1,
          },
          {
            tittleStr:'5.将新建的APN名称和APN都设置为【UNIM2M.NJM2MAPN】其他选项不设置',
            imgurl:pic1,
          }

        ],
      }
    },
    methods:{
      appleUserClick:function () {
        console.log('aaaaaaaaaaaaaaaaaaaaa');
      },
    }
  }
</script>



<style scoped>
  .topView{
    width: 100%;
    height: 2rem;
    border-bottom: 0.3em solid lightgray;
  }
  .redStr{
    color: red;
    font-size: 0.3rem;
  }

  .clickView{
    margin-left: .5rem;
  }

</style>

