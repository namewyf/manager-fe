const env = import.meta.env.MODE || 'prod';
const Envconfig = {
    dev: {
        baseApi: '/',
        mockApi: 'http://127.0.0.1:4523/m1/5357666-5029387-default'
    }
}
export default {
    env,
    mock: true,
    namespace: 'manager',
    ...Envconfig[env]
}