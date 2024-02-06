import request from '@/utils/request'

export function getDictionary() {
  return request({
    url: '/dictionary/get',
    method: 'get',
  })
}

export function getWasteDictionary() {
  return request({
    url: '/dictionary/getWaste',
    method: 'get',
  })
}

export function deleteDictionary(query){
  return request({
    url: '/dictionary/delete',
    method: 'post',
    params: query
  })
}

export function addDictionary(query){
  return request({
    url: '/dictionary/add',
    method: 'post',
    params: query
  })
}