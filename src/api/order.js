import request from '@/utils/request'

export function getUnfinished(query) {
  return request({
    url: '/order/getUnfinished',
    method: 'get',
    params: query 
  })
}

export function getFinished(query){
    return request({
        url: '/finished/getFinished',
        method: 'get',
        params: query
    })
}

export function createUnfinished(data){
    return request({
        url: '/order/createUnfinished',
        method: 'post',
        data
    })
}

export function updateUnfinished(data, id){
    return request({
        url: '/order/updateUnfinished',
        method: 'post',
        data,
        params: {id}
    })
}

export function deleteUnfinished(id){
    return request({
        url: '/order/deleteUnfinished',
        method: 'post',
        params: {id}
    })
}

export function finishUnfinished(id){
    return request({
        url: '/order/finishUnfinished',
        method: 'post',
        params: {id}
    })
}