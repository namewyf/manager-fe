// api管理
import request from './../uitils/request.js'
export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
        })
    },
    getNoticeCount(params) {
        return request({
            url: '/leave/count',
            method: 'get',
            data: {}
        })
    },
    getMenuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {}
        })
    },
    getUserList() {
        return request({
            url: '/users/list',
            method: 'get',
            data: {}
        })
    }
}
