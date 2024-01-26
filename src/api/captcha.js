import request from '@/utils/request'

export function getCaptcha() {
    return request({
        url: '/user/captcha',
        method: 'get'
    })
}
