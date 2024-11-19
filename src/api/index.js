// api管理
import request from './../uitils/request.js'
export default {
    login(params) {
        return request({
            url: '/users/login',
            method: 'post',
            data: params,
            mock: true
        })
    }
}
