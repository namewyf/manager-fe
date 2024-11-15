// Storage的封装

import config from "../config";
export default {
    // 存储数据
    setItem(key, val) {
        let storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    // 获取数据
    getItem(key) {
        return this.getStorage()[key]
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
    },
    clearItem(key) {
        let storage = this.getStorage()
        delete storage[key]//delete 是一个操作符，用于删除对象的属性
    },
    clearAll() {
        window.localStorage.clear()
    }
}