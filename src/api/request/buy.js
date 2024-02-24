import request from '@/utils/request'

export function getListBuy(query, token) {
  return request({
    url: '/purchaseRequest/getRequest',
    method: 'get',
    params: query,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function postPurchaseRequest(data, token){
  return request({
    url: '/purchaseRequest/addRequest',
    method: 'post',
    data: data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function getAllBuy(query, token){
  return request({
    url: '/purchaseRequest/getAll',
    method: 'get',
    params: query,
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export function approveBuyRequest(query, token){
  return request({
    url: '/purchaseRequest/approve',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function rejectBuyRequest(query, token){
  return request({
    url: '/purchaseRequest/reject',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}

export function setBuyRead(query, token){
  return request({
    url: '/purchaseRequest/setRead',
    method: 'post',
    params: query,
    headers: {
      'Authorization' : `Bearer ${token}`
    }
  })
}