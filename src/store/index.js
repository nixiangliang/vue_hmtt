import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto: 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201905%2F17%2F20190517211730_kurtr.thumb.1000_0.jpg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1652012481&t=7e18e86d4e4880f90ab28e590d1e973e', // 头像地址(默认值)
    userName: ''
  },
  mutations: {
    // 编码风格，mutations最好大写(区分)
    SET_USERPHOTO(state, value) {
      state.userPhoto = value
    },
    SET_USERNAME(state, value2) {
      state.userName = value2
    }
  },
  actions: {},
  modules: {}
})
