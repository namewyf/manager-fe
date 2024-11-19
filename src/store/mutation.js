// Mutations业务层

import storage from '../uitils/storage'

export default{
    saveUserInfo(state,userInfo){
        state.userInfo = userInfo
        storage.setItem('userInfo',userInfo)
    }
}