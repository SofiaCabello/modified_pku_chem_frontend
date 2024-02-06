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