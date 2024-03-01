import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login/userLogin',
    method: 'post',
    data
  })
}

export function deleteUser(query, token){
  return request({
    url: '/user/deleteUser',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function getRole(token){
  return request({
    url: '/user/getRole',
    method: 'get',
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/login/userInfo',
    method: 'get',
    params: { token }
  })
}

export function updateUser(data, token) {
  return request({
    url: '/user/updateUser',
    method: 'post',
    data,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function getUser(query){
  return request({
    url: '/user/getUser',
    method: 'get',
    params: query
  })
}

export function createUser(data){
  return request({
    url: '/user/createUser',
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
