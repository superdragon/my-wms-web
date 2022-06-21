import Vue from 'vue'
import Vuex from 'vuex'
import Account from "@/store/account";

Vue.use(Vuex)

const myStore = new Vuex.Store({
  modules: {
    account: Account,
  }
})

export default myStore
