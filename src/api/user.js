import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/userLogin',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/login/userInfo',
    method: 'get',
    params: { token }
  })
}

export function updateInfo(data) {
  return request({
    url: '/userTable/updateUser',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}
