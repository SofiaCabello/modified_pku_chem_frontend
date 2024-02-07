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

export function approveHazardRequest(data, token){
  return request({
    url: '/hazardRequest/approve',
    method: 'post',
    data: data,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}