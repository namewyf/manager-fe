const env = import.meta.env.mode || 'prod';
const Envconfig = {
    dev: {
        baseApi: '/',
        mockApi: 'http://127.0.0.1:4523/m1/5357666-5029387-default'
    }
}
export default {
    env,
    mock: true,
    ...Envconfig[env]
}