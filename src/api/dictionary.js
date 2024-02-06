import request from '@/utils/request'

export function getProducers(){
  return request({
      url: '/dictionary/getProducers',
      method: 'get'
  })
}

export function getLabs(){
  return request({
      url: '/dictionary/getLabs',
      method: 'get'
  })
}

export function getLocations(){
  return request({
      url: '/dictionary/getLocations',
      method: 'get'
  })
}

export function getSources(){
  return request({
      url: '/dictionary/getSources',
      method: 'get'
  })
}

export function getWastes(){
  return request({
      url: '/dictionary/getWasteTypes',
      method: 'get'
  })
}


