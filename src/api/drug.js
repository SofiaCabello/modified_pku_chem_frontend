import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/drug/getDrug',
    method: 'get',
    params: query
  })
}

export function getAll(query) {
  return request({
    url:'/drug/getAll',
    method: 'get',
    params: query
  })
}

export function getDrugList() {
  return request({
    url: '/drug/getDrugList',
    method: 'get'
  })
}

export function updateDrug(data) {
  return request({
    url: '/drug/updateDrug',
    method: 'post',
    data
  })
}

export function multipleUpdateDrug(data){
  return request({
    url: '/drug/multipleUpdateDrug',
    method: 'post',
    data
  })
}

export function createDrug(data) {
  return request({
    url: '/drug/createDrug',
    method: 'post',
    data
  })
}

export function deleteDrug(id) {
  return request({
    url: '/drug/deleteDrug',
    method: 'post',
    params: { id }
  })
}

export function getEchart(){
  return request({
    url: '/drug/getEchart',
    method: 'get'
  })
}


export function getRecord(query){
  return request({
    url: '/purchaseRecord/getRecord',
    method: 'get',
    params: query
  })
}