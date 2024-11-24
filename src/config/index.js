const env = import.meta.env.MODE || 'prod';
const Envconfig = {
    dev: {
        baseApi: '/',
        mockApi: 'https://apifoxmock.com/m1/5357666-5029387-default'
    },
    test:{
        baseApi: '/',
        mockApi: 'https://apifoxmock.com/m1/5357666-5029387-default'
    },
    prod: {
        baseApi: 'https://apifoxmock.com/m1/5357666-5029387-default',
        mockApi: ''
    }
}
export default {
    env,
    mock: true,
    namespace: 'manager',
    ...Envconfig[env]
}