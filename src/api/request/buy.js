import request from '@/utils/request'

export function getListBuy(query) {
  return request({
    url: '/purchaseRequest/getRequest',
    method: 'get',
    params: query
  })
}

export function postPurchaseRequest(data){
  return request({
    url: '/purchaseRequest/addRequest',
    method: 'post',
    data
  })
}