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
    getUserList(params) {
        return request({
            url: '/users/list',
            method: 'get',
            data: params
        })
    },
    userDel(params) {
        return request({
            url: '/users/delete',
            method: 'get',
            data: params
        })
    },
    getRoleList() {
        return request({
            url: '/roles/list',
            method: 'get',
            data: {}
        })
    },
    getDeptList() {
        return request({
            url: '/dept/list',
            method: 'get',
            data: {}
        })
    },
    userSubmit(params) {
        return request({
            url: '/users/operate',
            method: 'post',
            data: params
        })
    }
}
