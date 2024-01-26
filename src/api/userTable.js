import request from '@/utils/request'

export function fetchList(query) {
    return request({
        url: '/userTable/getUser',
        method: 'get',
        params: query
    })
}

export function deleteUser(id) {
    return request({
        url: '/userTable/deleteUser',
        method: 'post',
        params: { id }
    })
}

export function updateUser(data) {
    return request({
        url: '/userTable/updateUser',
        method: 'post',
        data
    })
}

export function createUser(data) {
    return request({
        url: '/userTable/createUser',
        method: 'post',
        data
    })
}



