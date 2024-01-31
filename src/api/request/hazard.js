import request from '@/utils/request'

export function getListHazard(query){
  return request({
    url: '/hazardRequest/getRequest',
    method: 'get',
    params: query
  })
}