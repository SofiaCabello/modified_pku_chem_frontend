import request from '@/utils/request'

export function getListBuy(query) {
  return request({
    url: '/purchaseRequest/getRequest',
    method: 'get',
    params: query
  })
}