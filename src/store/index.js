// vuex状态管理

import { createStore } from 'vuex'
import mutation from './mutation'
import storage from '../uitils/storage'
const state = {
    userInfo: storage.getItem('userInfo') || ''//获取用户信息
}
export default createStore({
    state,
    mutations: mutation
})