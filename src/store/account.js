import { asyncRoutes, resetRouter } from "@/router";
import router from "@/router";

const state = {
  accountId: '',
  loginName: '',
  userName: '',
  token: localStorage.getItem('wms-token'),
  menus: [],
  btns: [],
  btnMap: {},
}

const getters = {}

const mutations = {
  setAccount(state, account) {
    state.loginName = account.loginName
    state.userName = account.userName
    state.accountId = account.id
    state.token = account.token
    state.menus = account.permission.items
    state.btns = account.permission.btns
    localStorage.setItem('wms-token', account.token)
    // 二级菜单对象
    let pathsMap = {}
    account.permission.paths.forEach(item => {
      pathsMap[item] = true
    })
    // 三级按钮权限
    account.permission.btns.forEach(item => {
      state.btnMap[item] = true
    })
    // 重置路由
    resetRouter()
    // 动态添加路由
    // asyncRoutes = [{path:/emp},{path:/dep},{path:/company},{path:/account}...]
    asyncRoutes.forEach(item => {
      if (pathsMap[item.path]) {
        // 当前用户的权限包含某路由地址
        router.addRoute('sysLayout', item)
      }
    })
  },
  logout(state) {
    state.accountId =  ''
    state.userName = ''
    state.loginName = ''
    state.menus = []
    state.btns = []
    state.btnMap = {}
    localStorage.removeItem('wms-token')
    resetRouter()
  }
}

const actions = {
  setAccountAction(context, account) {
    return new Promise(resolve => {
      setTimeout(() => {
        context.commit('setAccount', account)
        resolve()
      }, 500)
    })
  },
  logoutAction(context) {
    return new Promise(resolve => {
      setTimeout(() => {
        context.commit('logout')
        resolve()
      }, 500)
    })
  }
}

export default {
  // 多模块命名空间
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
