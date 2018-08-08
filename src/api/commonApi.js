import axios from '@/util/ajax'

function login(userInfo) {
  return axios({
    url: '/login',
    method: 'post',
    data: {
      ...userInfo
    }
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取新Token
function getToken() {
  return axios({
    url: '/getToken',
    method: 'get'
  }).then((res) => {
    return Promise.resolve(res)
  })
}

// 获取该用户的菜单列表
function getNavList() {
  return axios({
    url: '/user/navlist',
    methods: 'post',
    data: {}
  }).then((res) => {
    return Promise.resolve(res)
  })
}

export {login, getToken, getNavList}
