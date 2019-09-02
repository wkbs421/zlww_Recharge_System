
import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
// 全局loading状态
export default new Vuex.Store({
  state: {
      isLoading: false
  },
  mutations: {
      updateLoadingStatus(state, isLoading) {
          state.isLoading = isLoading;
      }
  }
});

