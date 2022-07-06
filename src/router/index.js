import Vue from 'vue'
import VueRouter from "vue-router";
import store from '@/store'
import { autoLogin } from '@/api/account'

Vue.use(VueRouter)

const myRoutes = [
  {
    path: '/',
    name: 'index',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'sysLogin',
    component: () => import('@/views/SysLogin')
  },
  {
    path: '/layout',
    name: 'sysLayout',
    component: () => import('@/views/SysLayout'),
    children: [
      {
        path: '/home',
        name: 'sysHome',
        component: () => import('@/views/home/index'),
      },
    ]
  }
]

// 异步加载的layout子路由和菜单权限
export const asyncRoutes = [
  {
    path: '/account',
    name: 'accountMgr',
    component: () => import('@/views/account/index'),
  },
  {
    path: '/role',
    name: 'roleMgr',
    component: () => import('@/views/role/index'),
  },
  {
    path: '/permission',
    name: 'permissionMgr',
    component: () => import('@/views/permission/index'),
  },
  {
    path: '/goods',
    name: 'goodsMgr',
    component: () => import('@/views/goods/index'),
  },
  {
    path: '/goodsUnit',
    name: 'goodsUnitMgr',
    component: () => import('@/views/goodsUnit/index'),
  },
  {
    path: '/store',
    name: 'storeMgr',
    component: () => import('@/views/store/index'),
  },
  {
    path: '/emp',
    name: 'empMgr',
    component: () => import('@/views/employee/index'),
  },
  {
    path: '/goodsIn',
    name: 'goodsIn',
    component: () => import('@/views/goodsIn/index'),
  },
  {
    path: '/goodsOut',
    name: 'goodsOut',
    component: () => import('@/views/goodsOut/index'),
  },
  {
    path: '/transfer',
    name: 'stockTransfer',
    component: () => import('@/views/stockTransfer/index'),
  },
  {
    path: '/check',
    name: 'stockCheck',
    component: () => import('@/views/stockCheck/index'),
  },
  // {
  //   path: '/accountList',
  //   name: 'accountList',
  //   component: () => import('@/views/account/index'),
  // },
  // {
  //   path: '/accountAdd',
  //   name: 'accountAdd',
  //   component: () => import('@/views/account/add'),
  // },
  // {
  //   path: '/accountEdit',
  //   name: 'accountEdit',
  //   component: () => import('@/views/account/edit'),
  // },
  // {
  //   path: '/goodsInfo',
  //   name: 'goodsInfo',
  //   component: () => import('@/views/goods/GoodsInfo'),
  // },
  // {
  //   path: '/goodsAdd',
  //   name: 'goodsAdd',
  //   component: () => import('@/views/goods/GoodsAdd'),
  // },
  // {
  //   path: '/goodsEdit',
  //   name: 'goodsEdit',
  //   component: () => import('@/views/goods/GoodsEdit'),
  // },
  // {
  //   path: '/storeList',
  //   name: 'storeList',
  //   component: () => import('@/views/mystore/StoreList'),
  // },
  // {
  //   path: '/empList',
  //   name: 'empList',
  //   component: () => import('@/views/employee/EmpList'),
  // },
  // {
  //   path: '/safeStoreList',
  //   name: 'safeStoreList',
  //   component: () => import('@/views/mystore/SafeStoreList'),
  // },
  // {
  //   path: '/goodsInList',
  //   name: 'GoodsInList',
  //   component: () => import('@/views/goodsIn/GoodsInList'),
  // },
  // {
  //   path: '/addStoreList',
  //   name: 'AddStoreList',
  //   component: () => import('@/views/goodsIn/AddStoreList'),
  // },
  // {
  //   path: '/storeListInfo',
  //   name: 'StoreListInfo',
  //   component: () => import('@/views/goodsIn/StoreListInfo'),
  // },
  // {
  //   path: '/storeStatList',
  //   name: 'StoreStatList',
  //   component: () => import('@/views/storeStat/StoreStatList'),
  // },
  // {
  //   path: '/goodsAllocateList',
  //   name: 'GoodsAllocateList',
  //   component: () => import('@/views/goodsAllocate/GoodsAllocateList'),
  // },
  // {
  //   path: '/addGoodsAllocateList',
  //   name: 'AddGoodsAllocateList',
  //   component: () => import('@/views/goodsAllocate/AddGoodsAllocateList'),
  // },
  // {
  //   path: '/tradeList',
  //   name: 'TradeList',
  //   component: () => import('@/views/trade/TradeList'),
  // },
  // {
  //   path: '/addTrade',
  //   name: 'AddTrade',
  //   component: () => import('@/views/trade/AddTrade'),
  // },
  // {
  //   path: '/goodsOutList',
  //   name: 'GoodsOutList',
  //   component: () => import('@/views/goodsOut/GoodsOutList'),
  // },
  // {
  //   path: '/handleGoodsOut',
  //   name: 'HandleGoodsOut',
  //   component: () => import('@/views/goodsOut/HandleGoodsOut'),
  // },
  // {
  //   path: '/permissionList',
  //   name: 'PermissionList',
  //   component: () => import('@/views/permission/PermissionList'),
  // },
  // {
  //   path: '/rolesList',
  //   name: 'RolesList',
  //   component: () => import('@/views/permission/RolesList'),
  // },
]

const myRouter = new VueRouter({
  routes: myRoutes
})

//验证 store 中是否有账户信息，如果没有跳转到登录页面。
myRouter.beforeEach((to, from, next) => {
  // 验证store是否有用户登录成功后的认证信息(令牌token)
  const token = store.state.account.token
  // 跳转的地址如果是非login时，验证用户是否是正常进入系统
  if (to.name !== 'sysLogin') {
    // 没有用户登录的凭证
    if (!token) {
      next({
        path: '/login',
        replace: true,
      })
    } else { // 用户有token，但不一定有效
      // 判断store是否有用户信息，是否已经通过token登录成功
      const accountId = store.state.account.accountId
      if (!accountId) {
        // 没有登录信息，使用token登录
        autoLogin({token: token}).then(result => {
          // 使用token登录成功，保存登录信息
          store.dispatch('account/setAccountAction', result.data).then(() => {
            next({ ...to, replace: true })
          })
        })
      } else {
        // 已经使用token登录成功，直接放行
        next()
      }
    }
  } else {
    // 放行，跳转到登录页面
    next()
  }
})

// 重置路由
export function resetRouter() {
  myRouter.matcher = new VueRouter({
    routes: myRoutes,
  }).matcher
}

export default myRouter
