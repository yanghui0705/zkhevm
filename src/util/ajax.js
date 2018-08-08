/**
 * axios全局配置
 * TODO: 拦截器全局配置，根据实际情况修改
 */
import axios from 'axios'
import store from '../store'
import router from '../router'
import {Message} from 'element-ui'
import Auth from '@/util/auth'
import {getToken} from '../api/commonApi'

const CancelToken = axios.CancelToken

/**
 * Token校验
 * @param {function} cancel - 中断函数
 * @param {function} callback -  回调
 * @description 校验Token是否过期，如果Token过期则根据配置采用不同方法获取新Token
 *              自动获取Token：过期时自动调用获取Token接口。注意：当有任一请求在获取Token时，其余请求将顺延，直至新Token获取完毕
 *              跳转授权Token：过期时中断当前所有请求并跳转到对应页面获取Token。注意：跳转页面授权最佳实现应在授权页面点击触发
 */
function checkToken(cancel, callback) {
  console.log('checktoken')
  if (!Auth.hasToken()) {
    getToken().then(res => {
      store.commit('setTokens', res.token)
      callback()
    })
    console.log(store.getters.token)
  } else {
    callback()
  }
}

// 超时设置
const service = axios.create({
  // 请求超时时间
  timeout: 5000
})

// baseURL
// axios.defaults.baseURL = 'https://api.github.com';

// http request 拦截器
// 每次请求都为http头增加Authorization字段，其内容为token
service.interceptors.request.use(
  config => {
    console.log('axios 请求拦截' + config.url)

    let cancel
    config.cancelToken = new CancelToken(function executor(c) {
      cancel = c
    })

    // console.log(store.getters.token)

    if (config.url === '/getToken') {
      // cancel()
    } else {
      checkToken(cancel, function() {
        console.log(store.getters.token)
        Auth.setLoginStatus()
        config.headers.Authorization = store.getters.token
      })
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// http response 拦截器
// 针对响应代码确认跳转到对应页面
service.interceptors.response.use(
  response => {
    console.log(response.config.url)
    return Promise.resolve(response.data)
  },
  error => {
    if (axios.isCancel(error)) {
      console.log(error)
      return Promise.reject(new Error('Ajax Abort: 该请求在axios拦截器中被中断'))
    } else if (error.response) {
      switch (error.response.status) {
        case 401:
          router.push('error/401')
          break
        case 403:
          router.push('error/403')
          break
        default:
          Message({
            message: `服务器错误！错误代码：${error.response.status}`,
            type: 'error'
          })
      }
      return Promise.reject(error.response.data)
    }
  }
)

export default service
