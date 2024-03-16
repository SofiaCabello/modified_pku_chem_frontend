import request from '@/utils/request'

export function getListHazard(query, token){
  return request({
    url: '/hazardRequest/getRequest',
    method: 'get',
    params: query,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function createHazardRequest(data, token){
  return request({
    url: '/hazardRequest/createRequest',
    method: 'post',
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function getAllHazard(query, token){
  return request({
    url: '/hazardRequest/getAll',
    method: 'get',
    params: query,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function approveHazardRequest(query, token){
  return request({
    url: '/hazardRequest/approve',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function rejectHazardRequest(query, token){
  return request({
    url: '/hazardRequest/reject',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function setHazardRead(query, token){
  return request({
    url: '/hazardRequest/setRead',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function getRecentHazard(){
  return request({
    url: '/hazardRequest/getRecent',
    method: 'get'
  })
}