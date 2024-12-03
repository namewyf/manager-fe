import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import storage from '@/uitils/storage'

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
                component: () => import('@/views/Welcome.vue')
            },
            {
                name: 'user',
                path: '/system/user',
                mata: {
                    title: '用户管理'
                },
                component: () => import('@/views/User.vue')
            },
            {
                name: 'menu',
                path: '/system/menu',
                mata: {
                    title: '菜单管理管理'
                },
                component: () => import('@/views/Menu.vue')
            },
            {
                name: 'test',
                path: 'test',
                mata: {
                    title: '测试'
                },
                component: () => import('@/views/Test.vue')
            }
        ]
    },
    {
        name: 'login',
        path: '/login',
        meta: {
            title: '登录'
        },
        //这里实现了路由的按需加载，动态导入，如果把import放在顶部引入，那么首页加载的时候就会加载所有组件，导致首页加载速度变慢
        //这里的import是一个函数，返回一个promise，在promise中返回一个组件，在加载的时候才加载组件
        component: () => import('@/views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes
})
router.beforeEach(async (to, from) => {
    if (
        // 检查用户是否已登录
        !storage.getItem('userInfo') &&
        // ❗️ 避免无限重定向
        to.name !== 'login'
    ) {
        // 将用户重定向到登录页面
        return { name: 'login' }
    }
})
export default router;
