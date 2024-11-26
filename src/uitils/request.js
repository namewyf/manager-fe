// axios二次封装
import axios from "axios";
import config from "../config";
import { ElMessage } from "element-plus";

import router from "../router";
const TOKEN_INVALID = 'Token认证失败，清重新登录'
const NETWORK_ERROR = '网络请求异常，请稍后重试'

// 通过create方法创建axios实例,添加全局配置
const service = axios.create({
    baseURL: config.baseApi,// 请求url的默认前缀
    timeout: 8000
})

//请求拦截
// 请求拦截器
service.interceptors.request.use((req) => {
    //TO-DO
    const headers = req.headers;
    if (!headers.Authorization) {
        headers.Authorization = 'Bear Jack'
    }
    return req
})

//响应拦截
service.interceptors.response.use((res) => {
    const { code, data, msg } = res.data
    if (code === 200) {
        return data
    } else if (code === 40001) {
        ElMessage.error(TOKEN_INVALID)
        setTimeout(() => {
            router.push('/login')
        }, 15000);
        return Promise.reject(TOKEN_INVALID)
    } else {
        ElMessage.error(msg || NETWORK_ERROR)
        return Promise.reject(msg || NETWORK_ERROR)
    }
})

//这个是request核心函数的封装
function request(options) {
    console.log("调用了request，options=", options);
    options.method = options.method || 'get'
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }
    if (typeof options.mock !== 'undefined') {
        config.mock = options.mock;//如果传过来的options里面有mock，就使用传过来的，如果没有，就使用全局的
    }
    if (config.env === 'production') {
        service.defaults.baseURL = config.baseApi//如果是生产环境，直接使用baseApi
    } else {
        service.defaults.baseURL = config.mock ? config.mockApi : config.baseApi
    }
    return service(options)//这里返回的是一个axios对象
}

['get', 'post', 'put', 'delete', 'patch'].forEach((item) => {
    request[item] = (url, data, options) => {//options可以对请求的参数做一些额外的拓展，比如可以传mock:true,或者loading之类的东西
        return request({
            url,
            data,
            method: item,
            ...options
        })
    }
})

export default request