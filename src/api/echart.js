import request from '@/utils/request'

export function getProducerRatio(){
  return request({
    url: '/echart/producerRatio',
    method: 'get'
  })
}