import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    /* {
      path: '/index',
      name: 'index',
      // meta:{keepAlive:true},
      component: resolve => require(['com/page/index.vue'], resolve),
    }, */
    {
      path: '/index',
      name: 'index',
      // meta:{keepAlive:true},
      component: resolve => require(['com/page/search.vue'], resolve)
    },
    {
      path: '/rechargeCardsPay',
      name: 'rechargeCardsPay',
      // meta:{keepAlive:true},
      component: resolve =>
        require(['com/page/rechargeCards/rechargeCardsPay.vue'], resolve)
    },
    {
      path: '/rechargeCardsOp',
      name: 'rechargeCardsOp',
      // meta:{keepAlive:true},
      component: resolve =>
        require(['com/page/rechargeCards/rechargeCardsOp.vue'], resolve)
    },
    {
      path: '/rechargeCards',
      name: 'rechargeCards',
      // meta:{keepAlive:true},
      component: resolve =>
        require(['com/page/rechargeCards/rechargeCards.vue'], resolve)
    },
    {
      path: '/rechargeCardsResult',
      name: 'rechargeCardsResult',
      // meta:{keepAlive:true},
      component: resolve =>
        require(['com/page/rechargeCards/rechargeCardsResult.vue'], resolve)
    }
    /* {
      path: '/declare',
      name: 'declare',
      component: resolve => require(['com/page/declare/declare.vue'], resolve),
    },
    {
      path: '/flowSearch',
      name: 'flowSearch',
      component: resolve => require(['com/page/flowSearch/flowSearch.vue'], resolve),
    },
    {
      path: '/login',
      name: 'login',
      component: resolve => require(['com/page/login/login.vue'], resolve),
    },
    {
      path: '/activate',
      name: 'activate',
      component: resolve => require(['com/page/login/activate.vue'], resolve),
    },
    {
      path: '/myCenter',
      name: 'myCenter',
      component: resolve => require(['com/page/me/myCenter.vue'], resolve),
    },
    {
      path: '/addCard',
      name: 'addCard',
      component: resolve => require(['com/page/me/addCard.vue'], resolve),
    },
    {
      path: '/addPackage',
      name: 'addPackage',
      component: resolve => require(['com/page/packageManage/addPackage.vue'], resolve),
    },
    {
      path: '/checkOrder/',
      name: 'checkOrder',
      component: resolve => require(['com/page/packageManage/checkOrder.vue'], resolve),
    },
    {
      path: '/RechargeDetailed',
      name: 'RechargeDetailed',
      component: resolve => require(['com/page/RechargeDetailed/RechargeDetailed.vue'], resolve),
    },
    {
      path: '/loginCenter',
      name: 'loginCenter',
      component: resolve => require(['com/page/loginCenter/loginCenter.vue'],resolve),
    },
    {
      path: '/phoneLogin',
      name: 'phoneLogin',
      component: resolve => require(['com/page/phoneLogin/phoneLogin.vue'],resolve,),
    },
    {
      path: '/bandCard',
      name: 'bandCard',
      component: resolve => require(['com/page/phoneLogin/bandCard.vue'],resolve,),
    }, */
  ]
})
