import axios from 'axios'
import qs from 'qs'
import { Message } from 'element-ui'
import store from "@/store"
import router from "@/router";

// 非正常状态码时的处理器
const handleCode = (respData) => {
  const {code, data, msg} = respData
  // 获取处理失败原因
  const content = data || msg + ` | 错误码 ${code}`
  switch (code) {
    /**
     * token失效的处理逻辑：
     * 如果后端验证token失效，返回code:402，这个标识可以在 net.config.js 中的 invalidCode 属性进行配置
     * 那么如果前端开启了token失效返回登录页面的逻辑
     */
    case 404:
      Message.error('接口访问地址错误404')
      break
    case 401:
      Message.error('账户Token失效!401')
      store.dispatch('account/logoutAction').then(() => {
        router.push({
          path: '/login',
          replace: true,
        })
      }).catch(() => {})
      break
    case 402:
      Message.error('账户无权限!402')
      store.dispatch('account/logoutAction').then(() => {
        router.push({
          path: '/login',
          replace: true,
        })
      }).catch(() => {})
      break
    default:
      Message.error(content)
      break
  }
}

const baseURL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : ''

const instance = axios.create({
  // 请求后端 API 的基础地址
  baseURL,
  // 请求超时时间，单位毫秒。
  // 如果后端在规定时间内容没有给出响应结果，将会抛出错误，并触发 catch 方法
  timeout: 30000,
  headers: {
    // 默认是 application/json 请求
    'Content-Type': 'application/json;charset=UTF-8',
  },
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = store.state.account.token
    if (token) {
      config.headers['token'] = token
    }
    // 如果是表单请求，自动修改 Content-Type 内容为表单类型
    if (config.requestMethod === 'form') {
      config.headers['Content-Type'] =
        'application/x-www-form-urlencoded;charset=UTF-8'
      config.data = qs.stringify(config.data)
    }
    // 如果是上传文件请求，自动修改 Content-Type 内容为 multipart/form-data 类型
    if (config.requestMethod === 'file') {
      config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'
    }
    return config
  },
  (error) => {
    // 请求出错
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 获取响应数据结构，并存放到变量 data 中
    const {data, config, headers} = response
    // 获取响应头的token信息
    const token = headers['token']
    if (token) {
      // 重置 store 中的token
      store.commit('account/setToken', token)
    }
    // 获取变量 data 中的 code 和 msg 属性值
    const {code, msg} = data
    // 判断 code 是否是正常状态. 200 : 代表请求处理成功
    if (code === 200) {
      // 如果请求被后端服务正确处理，那么返回服务响应的结果
      return data
    } else {
      // 如果请求处理失败，则由handleCode统一处理，页面弹出提示框，提示处理失败原因
      handleCode(data)
      return Promise.reject(
        '请求异常拦截:' + JSON.stringify({url: config.url, code, msg}) ||
        'Error'
      )
    }
  },
  (error) => {
    const {response, message} = error
    if (error.response && error.response.data) {
      console.log(response)
      const {status, data} = response
      handleCode({
        code: status,
        data: data.msg || message,
      })
      return Promise.reject(error)
    } else {
      let {message} = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        const code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }
      return Promise.reject(error)
    }
  }
)

export default instance
