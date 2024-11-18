import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Login from '../components/Login.vue'


const routes = [
    {
        name: 'home',
        path: '/',
        meta: {
            title: '首页'
        },
        component: Home,
        redirect: '/welcome',
        children: [
            {
                name: 'welcome',
                path: '/welcome',
                meta: {
                    title: '欢迎页'
                },
                component: Welcome,
            },
            {
                name: 'login',
                path: '/login',
                meta: {
                    title: '登录'
                },
                component: Login,
            }
        ]
    },
    // {
    //     name: 'login',
    //     path: '/login',
    //     meta: {
    //         title: '登录'
    //     },
    //     //这里实现了路由的按需加载，动态导入，如果把import放在顶部引入，那么首页加载的时候就会加载所有组件，导致首页加载速度变慢
    //     //这里的import是一个函数，返回一个promise，在promise中返回一个组件，在加载的时候才加载组件
    //     component: () => import('../components/Login.vue')
    // }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
export default router;
