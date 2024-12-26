---
date: 2024-11-11
category:
  - CategoryC
tag:
  - tag E
sticky: 20
---
# 后台管理项目0-1搭建笔记

基于elementui、vue3、koa的后台管理项目

<!-- more -->

## 第零章 项目介绍

项目github仓库地址：[https://github.com/namewyf/manager-fe](https://github.com/namewyf/manager-fe)  
项目演示地址：[https://namewyf.github.io/manager-fe/#/login](https://namewyf.github.io/manager-fe/)

## 第二章 前端架构设计

### 2-3 目录结构规范

如果是node环境，我们使用process.env，来管理环境变量
如果是vite，则使用import.meta.env

### 2-6 环境配置封装

可以通过配置package.json里面的scripts里配置命令，--mode dev，那么import.meta.env.MODE的值就是dev了，默认不配置的话，值是production

```json
"scripts": {
    "dev": "vite --mode dev",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "push-dir --dir=dist --branch=gh-pages --cleanup"
  },
```

config/index.js

```js
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
```

### 2-8 axios二次封装（下）

构造好request的封装函数后在main.js里进行全局挂载之后才能在组件进行全局使用

```js
import request from './uitils/request';
app.config.globalProperties.$request = request
```

> 在js里request和request()是不同的，request是将request函数本身赋值给app.config.globalProperties.$request
> 如果说是request()则是先执行request然后将返回值赋值给app.config.globalProperties.$request

封装完成后，就能在组件里面调用了

```js
  mounted() {
    this.$request({
      method:'get',
      url:'/login',
      data:{
        name:'jack'
      }
    }).then((res)=>{
       console.log("res=",res);
    })
  }
```

为了更加方便的进行调用，我们还可以把request函数转换成一个对象，这个对象里有各种请求的方法

request.js

```js
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
```

> 1. 这个地方非常巧妙地把函数request转换为对象request，并且把多个属性添加到request对象里，属性的值是函数
> 2. options可以对请求的参数做一些额外的拓展，比如可以传mock:true,或者loading:true之类的东西

login.vue

```js
  mounted() {
    this.$request.get('/login',{name:'jack'}).then((res)=>{
      console.log(res);
    })
  }
```

### 2-9 storage二次封装

#### storage的使用场景：

1. 在用户进行登陆的时候，用来存储服务器发来的jwt(token)
2. 跨组件的数据共享，如果使用vuex只是一个数据共享，只是一个数据的管理，数据都只是存储在js内存里，当页面刷新的时候数据都会销毁，所以我们一般使用vuex结合local storage去做存储和管理
3. storage比cookie存储的数据的量更多的

#### local storage封装的目的：

定义不同的命名空间对变量名进行隔离，防止不同命名的冲突,但是local storage只能存储字符串，所以需要把对象转化为字符串再存储，这时候就可以使用JSON.stringify()方法来序列化对象，然后通过JSON.parse()方法来还原对象

> 序列化（Serialization）是将数据结构或对象的状态转换为一个可存储或传输的格式的过程

> 注意json语法的对象里面的key必须要加双引号(对，是必须是双引号)

utils/storage.js

```js
// Storage的封装

import config from "../config";
export default {
    setItem(key, val) {
        let storage = this.getStorage()
        storage[key] = val
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    getItem(key) {
        return this.getStorage()[key]
    },
    getStorage() {
        return JSON.parse(window.localStorage.getItem(config.namespace) || '{}')
    },
    clearItem(key) {
        let storage = this.getStorage()
        delete storage[key]//delete 是一个操作符，用于删除对象的属性
        window.localStorage.setItem(config.namespace, JSON.stringify(storage));
    },
    clearAll() {
        window.localStorage.clear()
    }
}
```

config/index.js

```js
export default {
    namespace: 'manager'
}
```

App.vue

```js
    mounted(){
      this.$storage.setItem('name','Tom')
    }
```

> 注：在开发者工具中查看 localStorage 中存储的值时,确实会以对象的形式显示,即使你使用 JSON.stringify() 将其转换为字符串存储。
> 这是因为开发者工具会尝试解析和显示存储的值的实际数据结构,而不仅仅是字符串形式。虽然 localStorage 中存储的是字符串,但开发者工具会尝试将其转换回原始的数据结构以便于查看和调试。
> 所以即使你将对象转换为 JSON 字符串存储,开发者工具还是会尽量还原成对象的形式显示。这是开发者工具的一个特性,旨在为开发者提供更直观的数据查看体验。
> 但实际上,在 localStorage 中存储的确是字符串形式的 JSON 数据。当你从 localStorage 中读取数据时,需要使用 JSON.parse() 将字符串转换回原始的对象或数组。
> 总之,开发者工具的显示行为和 localStorage 的实际存储方式是不同的。这是开发者工具的一个特性,旨在为开发者提供更友好的数据查看体验。

### 2-10 主页结构布局

#### 引入全局的样式文件

放在assets目录下，目录如下
-assets
--style
---index.scss
---reset.css
--logo.png

index.scss里是有一些公共的样式，是针对本项目设置的一些公共样式和业务样式

> reset.css 文件, 类似于base.css, 是一个用于重置浏览器默认样式的样式表。其主要目的是消除不同浏览器之间对HTML元素默认样式的差异，以确保网页在各种浏览器中呈现一致的外观

App.vue里面引入：

```css
<style lang="scss">
/* style样式要通过@import的方式进行引入 */
/* 不过import已经被弃用了ys 的vite-plugin-sass-glob-resolver插件所取代，
所以这里不再使用import，而是使用@use，
@use与@import的区别是，@import会引入所有样式，而@use只会引入用到的样式，
所以@use性能更好，但需要使用css变量， */
@use "./assets/style/index.scss";
@use "./assets/style/reset.css";
</style>
```

这里要加lang="scss"

vite.config.js

```js
  //配置 Vite 项目中 SCSS 预处理器的 API 类型，指定使用现代编译器。这有助于确保 SCSS 文件在编译时使用最新的编译方式，提高兼容性和性能。
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern-compiler" // or 'modern'
      }
    }
  },
```

Home.vue

```js
<template>
  <div class="basic-layout">
    <!-- 导航栏 -->
    <div class="nav-side"></div>
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- 顶部导航栏 -->
      <div class="nav-top">
        <div class="bread">
          面包屑
        </div>
        <div class="user-info">
          用户名
        </div>
      </div>
      <div class="wrapper">
        <div class="main-page">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {},
  data() {
    return {}
  },
  methods: {},
  mounted() { }
}
</script>

<style lang="scss">
.basic-layout {
  position: relative;

  .nav-side {
    position: fixed;
    width: 200px;
    height: 100vh;
    background-color: #001529;
    color: #fff; //文字颜色为白色
    overflow-y: auto; //滚动条
    transition: width 0.5s //宽度变化的动画
  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between; //控制两端对齐
      border-bottom: 1px solid #ddd;
      padding: 0 20px;
    }

    .wrapper {
      background: #eef0f3;
      padding: 20px;
      height: calc(100vh - 50px); //计算属性

      .main-page {
        background: #fff;
        height: 100%;
      }
    }
  }
}
</style>

```

## 第四章 用户登录前后端实现

### 4-1登录布局开发

登录页面没有复用主页面的布局，所以需要单独的布局

1. 这里实现了路由的按需加载，动态导入，如果把import放在顶部引入，那么首页加载的时候就会加载所有组件，导致首页加载速度变慢
2. 这里的import是一个函数，返回一个promise，在promise中返回一个组件，在加载的时候才加载组件

router/index.js

```js
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
                component: ()=> import('../views/Welcome.vue')
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
        component: () => import('../views/Login.vue')
    }
]
```

1. justify-content和align-items这两个属性很重要，要记住

views/Login.vue

```js
<template>
  <div class="login-wrapper">
    <div class="modal">
      <el-form>
        <div class="title">火星</div>
        <el-form-item>
          <el-input type="text" :prefix-icon="User" />
        </el-form-item>
        <el-form-item>
          <el-input type="password" :prefix-icon="Lock" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { User, Lock } from '@element-plus/icons-vue'

export default {
  name: 'login',
  components: {},
  data() {
    return {
      User,
      Lock
    }
  },
  methods: {
    gotHome() {
      this.$router.push('/welcome')
    }
  },
  mounted() {
    // this.$request({
    //   method:'get',
    //   url:'/login',
    //   data:{
    //     name:'jack'
    //   }
    // }).then((res)=>{
    //    console.log("res=",res);
    // })
    this.$request.get('/login', { name: 'jack' }).then((res) => {
      console.log(res);
    })
  }
}
</script>

<style lang="scss">
.login-wrapper {
  display: flex;
  // justify-content和align-items这两个属性很重要，要记住
  justify-content: center;
  align-items: center;
  background-color: #f9fcff;
  height: 100vh;
  width: 100vw;

  .modal {
    width: 500px;
    padding: 50px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0px 0px 10px 3px #c7c9cb4d;

    .title {
      font-size: 50px;
      text-align: center;
      line-height: 1.5;
      margin-bottom: 30px;
    }

    .btn-login {
      width: 100%;
    }
  }
}
</style>

```

### 4-2登录交互开发

api/index.js

```js
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
```

1. 通过vuex配合storage实现用户登录状态

store/index.js

```js
// vuex状态管理
import { createStore } from 'vuex'
import mutation from './mutation'
import storage from '../uitils/storage'
const state = {
    userInfo:''||storage.getItem('userInfo')//获取用户信息
}
export default createStore({
    state,
    mutations:mutation
})
```

store/mutation.js

```js
// Mutations业务层

import storage from '../uitils/storage'

export default{
    saveUserInfo(state,userInfo){
        state.userInfo = userInfo
        storage.setItem('userInfo',userInfo)
    }
}
```

Login.vue

```js
<div class="login-wrapper">
    <div class="modal">
      <!-- 表单中设置 ref 属性很重要，它让我们能够在 JavaScript 代码中方便地操作表单组件。 -->
      <el-form :model="user" status-icon ref="userForm" :rules="rules">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input type="text" :prefix-icon="User" v-model="user.userName"/>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" :prefix-icon="Lock" v-model="user.userPwd"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
</div>
```

```js
data(){
      Lock,
      user:{
        userName:'',
        userPwd:''
      },
      rules:{
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
}
```

```js
methods:{
    login(){
      this.$refs.userForm.validate((valid) => {
        if(valid){
          this.$api.login(this.user).then((res)=>{
            this.$store.commit('saveUserInfo',res)
            this.$router.push('/welcome')
          })
        }else{
          return false
        }
      })
    },
}
```

main.js

```js
import store from './store';
import api from './api';
app.config.globalProperties.$api = api
// app.config.globalProperties.$store = store这样挂载理论是可行的但是不推荐
app.use(router).use(store).use(ElementPlus).mount('#app');
```

### 4-3用户登录后台实现

## 第五章 前台首页实现

### 5-1欢迎页面实现

```js
<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>
      <div class="title">通用后台管理系统</div>
      <div class="desc">-Vue3.0+ElementPlus+Node+Mongo打造通用后台管理系统</div>
    </div>
    <div class="img">
    </div>
  </div>title
</template>

<style lang="scss">
.welcome {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  .content{
    position: relative;
    bottom: 40px;
    .sub-title{
      font-size: 30px;
      line-height: 42px;
      color: #333;
    }
    .title{
      font-size: 40px;
      line-height: 62px;
      color: #409eff;
    }
    .desc{
      text-align: right;
      font-size: 14px;
      color: #999;
    }
  }
  .img{
    margin-left: 105px;
    background-image: url('../assets/images/welcome.png');
    width: 371px;
    height: 438px;
  }
}
</style>
```

### 5-2首页菜单实现上

菜单栏

```js
   <div class="nav-side">
      <!-- 系统logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu default-active="2" background-color="#001529" text-color="#fff" router :collapse="false"
        class="nav-menu">
        <el-sub-menu index="1">
          <!-- 这个地方的template是插槽语法，#title是v-slot的缩写，表示将内容插入到父组件中名为 title 的插槽中。 -->
          <template #title>
            <el-icon>
              <setting />
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">用户管理</el-menu-item>
          <el-menu-item index="1-2">菜单管理</el-menu-item>
          <el-menu-item index="1-3">角色管理</el-menu-item>
          <el-menu-item index="1-4">部门管理</el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <setting />
            </el-icon>
            <span>审批管理</span>
          </template>
          <el-menu-item index="2-1">休假审批</el-menu-item>
          <el-menu-item index="2-2">待我审批</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>
  
    .logo {
      display: flex;
      align-items: center;
      font-size: 18px;
      height: 50px;

      img {
        width: 32px;
        height: 32px;
        margin: 0 16px;
      }
    }

    .nav-menu {
      border-right: none;
      height: calc(100vh - 50px);
    }
```

> 这个地方的template是插槽语法，#title是v-slot的缩写，表示将内容插入到父组件中名为 title 的插槽中。

折叠按钮

```js
        <div class="nav-left">
          <div class="menu-fold">
            <el-icon>
              <Operation />
            </el-icon>
          </div>
          <div class="bread">
            面包屑
          </div>
        </div>
```

### 5-3首页菜单实现下

控制菜单折叠时的样式

```js
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">

    
    //在 SCSS 中，& 符号代表当前父选择器。当你在一个嵌套的选择器中使用 & 时，它会将父选择器与子选择器组合在一起。
    //合并
    &.fold {
      width: 64px;
    }

    //展开
    &.unfold {
      width: 200px;
    }

  

    &.fold {
      margin-left: 64px;
    }

    &.unfold {
      margin-left: 200px;
    }
```

> 在 SCSS 中，& 符号代表当前父选择器。当你在一个嵌套的选择器中使用 & 时，它会将父选择器与子选择器组合在一起。

控制菜单是否折叠

```js
      <el-menu default-active="2" background-color="#001529" text-color="#fff" router :collapse="isCollapse"
```

顶部菜单用户名下拉菜单

```js
          <el-badge :is-dot="true" class="notice">
            <el-icon>
              <Bell />
            </el-icon>
          </el-badge>
          <el-dropdown @command="handleLogout">
            <span class="user-link">
              {{ userInfo.userName }}
              <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="email">邮箱：{{ userInfo.userEmail }}</el-dropdown-item>
                <el-dropdown-item command="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        
  data() {
    return {
      userInfo: {
        userName: 'admin',
        userEmail: 'admin@qq.com'
      },
      isCollapse: false
    }
  },
  methods: {
    toggle() {
      this.isCollapse = !this.isCollapse
    },
    handleLogout(key) {
      if (key == 'logout') {
        this.$store.commit('saveUserInfo', '')
        this.userInfo = null
        this.$router.push('/login')
      }
    }
  },
```

### 5-4菜单交互及递归实现上

#### 通知栏红点

```js
          <el-badge :is-dot="noticeCount" class="notice">
        
  methods: {
    async getNoticeCount(){
      try{
        const count = await this.$api.getNoticeCount()
        this.noticeCount = count
      }catch(error){
        console.error(error);
      }
    }
  },
  mounted() { 
    this.getNoticeCount()
  }
```

api/index.js

```js

    getNoticeCount(params){
        return request({
            url: '/leave/count',
            method: 'get',
            data:{}
        })
    }
```

#### 左侧菜单栏组件独立出来

Home.vue

```js
<TreeMenu :userMenu="userMenu"></TreeMenu>


    async getMenuList() {
      try {
        const list = await this.$api.getMenuList()
        this.userMenu = list
      } catch (error) {
        console.error(error);
      }
    }

    mounted() {
      this.getMenuList()
    }
```

TreeMenu.vue

```js
<template>
    <el-sub-menu index="1">
        <!-- 这个地方的template是插槽语法，#title是v-slot的缩写，表示将内容插入到父组件中名为 title 的插槽中。 -->
        <template #title>
            <el-icon>
                <setting />
            </el-icon>
            <span>系统管理</span>
        </template>
        <el-menu-item index="1-1">用户管理</el-menu-item>
        <el-menu-item index="1-2">菜单管理</el-menu-item>
        <el-menu-item index="1-3">角色管理</el-menu-item>
        <el-menu-item index="1-4">部门管理</el-menu-item>
    </el-sub-menu>
    <el-sub-menu index="2">
        <template #title>
            <el-icon>
                <setting />
            </el-icon>
            <span>审批管理</span>
        </template>
        <el-menu-item index="2-1">休假审批</el-menu-item>
        <el-menu-item index="2-2">待我审批</el-menu-item>
    </el-sub-menu>
</template>

<script>
export default {
    name: 'TreeMenu',
    components: {},
    props: {
        userMenu: {
            type: Array,
            // 直接使用 default: [] 会导致所有实例共享同一个数组引用，要用函数形式返回默认值
            default() {
                return []
            }
        }
    },
    data() {
        return {}
    },
    methods: {},
    mounted() { }
}
</script>

<style lang="scss" scoped></style>

```

> 直接使用 default: [] 会导致所有实例共享同一个数组引用，当默认的值是数组或对象时，要用函数形式返回默认值

api/index.js

```js
    getMenuList() {
        return request({
            url: '/menu/list',
            method: 'get',
            data: {}
        })
    }
```

### 5-5菜单交互及递归实现下

动态绑定activeMenu

```js
      <el-menu :default-active="activeMenu" background-color="#001529" text-color="#fff" router :collapse="isCollapse"
    
      isCollapse: false,
      activeMenu: location.hash.slice(1)//location.hash可以获取到当前路由地址
```

> location.hash可以获取到当前路由地址

递归生成菜单

```js

    <template v-for="menu in userMenu">
        <el-sub-menu v-if="menu.children && menu.children.length > 0 && menu.children[0].menuType == 1" :key="menu._id"
            :index="menu.path">
            <!-- 这个地方的template是插槽语法，#title是v-slot的缩写，表示将内容插入到父组件中名为 title 的插槽中。 -->
            <template #title>
                <el-icon>
                    <setting />
                </el-icon>
                <span>{{ menu.menuName }}</span>
            </template>
            <tree-menu :userMenu="menu.children" />
        </el-sub-menu>
        <el-menu-item v-else-if="menu.menuType == 1" :index="menu.path" :key="`item-${menu._id}`">{{ menu.menuName
            }}</el-menu-item>
    </template>

```

### 5-6面包屑实现

面包屑是利用route.matched，matched是当前路由的所有嵌套路径，包含当前的路径，同时设置只有首页按钮可以点击
Breadcrumb.vue

```js
<template>
    <el-breadcrumb :separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item,index) in breadList" :index="item.path">
            <router-link to="/welcome" v-if="index == 0">{{ item.meta.title }}</router-link>
            <span v-else>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script>
import { ArrowRight } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
export default {
    name: 'BreadCrumb',
    components: {},
    data() {
        return {
            ArrowRight:markRaw(ArrowRight)
        }
    },
    computed: {
        //这里必须使用计算属性，否则无法监听到路由的变化
        breadList(){
            return this.$route.matched
        }
    },
    methods: {},
    mounted() { }
}
</script>

<style lang="scss" scoped></style>

```

> breadList这里必须使用计算属性，否则无法监听到路由的变化

### 5-7知识补充

1. import组件的地址后面必须要有.vue后缀
2. 在vite.config.js中配置别名，将./../src配置为@

```js
import path from 'path'
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')//__dirname 表示当前文件所在的目录
        }
    }
```

> __dirname 表示当前文件所在的目录
> path.resolve() 将路径片段解析为绝对路径

3. 全局的mixin样式问题，通过vite进行配置

```js
css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/style/base.scss";`,
        api: "modern-compiler" // or 'modern'
      }
    }
},
```

## 第六章 JWT方案讲解

### 6-1.JWT理论介绍

JWT是一种跨域的认证解决方案

#### 解决跨域问题的方法：

1. 配置CORS跨域  ：
* 需要前后端都配置正确的cors设置
* 依赖cookie机制

```js
// 后端配置
app.use(cors({
  origin: 'http://example.com', // 允许的源
  credentials: true  // 允许携带凭证
}));
// 前端配置
fetch('http://api.example.com/data', {
  credentials: 'include'  // 允许发送cookie
})
```

2. JWT
用户登录后就会得到一个token存在客户端，每次请求都携带这个token，服务端会验证token的有效性。  
* 不依赖 Cookie
* jwt会生成签名，保证数据安全
* jwt具有时效性
* jwt更高效利用集群做好单点登录
```js
// 前端发送请求
fetch('http://api.example.com/data', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```
3. session
将用户的信息存储在服务器上，通过sessionId来识别用户，每次请求都携带这个sessionId，服务端会验证sessionId的有效性。  

只能用于单台服务器的情况

无法实现单点登录，即允许用户使用一组凭证（如用户名和密码）登录一次，即可访问多个相互信任的应用系统或服务，而无需在每个系统中重复进行身份验证

#### jwt原理
服务器认证后，生成一个json对象，后续通过json进行通信   
包括：Header、Payload、Signature

#### 使用方式
* /api?token=xxx
* cookie写入token
* localStorage写入token，请求头中携带Authorization: Bearer xxx

## 第七章 用户管理前后端实现

### 7-1&7-2用户管理列表实现（上下）

这里使用的是composition api

views/User.vue
```js
<template>
    <div class="user-manage">
        <div class="query-form">
            <el-form :inline="true" :model="user" class="form-inline">
                <el-form-item>
                    <el-input v-model="user.userId" placeholder="请输入用户ID"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input v-model="user.userName" placeholder="请输入用户昵称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="user.state" placeholder="请选择状态" clearable>
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="1" label="在职"></el-option>
                        <el-option :value="2" label="离职"></el-option>
                        <el-option :value="3" label="试用期"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary">查询</el-button>
                    <el-button>重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary">新增</el-button>
                <el-button type="danger">批量删除</el-button>
            </div>
            <el-table :data="userList">
                <el-table-column type="selection" width="55" />
                <el-table-column v-for="item in columns" :key="item.prop" :prop="item.prop" :label="item.label"
                    :width="item.width" />
                <el-table-column label="操作" width="130">
                    <template #default="scope">
                        <el-button @click="handleClick(scope.row)" size="small">编辑</el-button>
                        <el-button type="danger" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
//这里使用的是composition api
import { onMounted, reactive, ref } from 'vue'
export default {
    name: 'user',
    setup() {
        const user = reactive({})
        const userList = ref([
            {
                "state": 1,
                "role": "0",
                "roleList": [
                    "60180b07b1eaed6c45fbebdb",
                    "60150cb764de99631b2c3cd3",
                    "60180b59b1eaed6c45fbebdc"
                ],
                "deptId": [
                    "60167059c9027b7d2c520a61",
                    "60167345c6a4417f2d27506f"
                ],
                "userId": 1000002,
                "userName": "admin",
                "userEmail": "admin@imooc.com",
                "createTime": "2021-01-17T13:32:06.381Z",
                "lastLoginTime": "2021-01-17T13:32:06.381Z",
                "__v": 0,
                "job": "前端架构师",
                "mobile": "17611020000"
            }
        ])
        const columns = reactive([
            {
                label: '用户ID',
                prop: 'userId',
            },
            {
                label: '用户名',
                prop: 'userName',
            },
            {
                label: '用户邮箱',
                prop: 'userEmail',
            },
            {
                label: '用户角色',
                prop: 'role',
            },
            {
                label: '用户状态',
                prop: 'state',
            },
            {
                label: '注册时间',
                prop: 'createTime',
            },
            {
                label: '最后登录时间',
                prop: 'lastLoginTime',
            }
        ])
        onMounted(() => {
            console.log("...init");
        })
        return {
            user,
            userList,
            columns
        }
    },
}
</script>

<style lang="scss" scoped>
.form-inline .el-input {
    --el-input-width: 220px;
}

.form-inline .el-select {
    --el-select-width: 220px;
}
</style>
```
### 7-3用户列表交互实现

api/index.js
```js
    getUserList() {
        return request({
            url: '/users/list',
            method: 'get',
            data: {}
        })
    }
```

User.vue
```js
import { getCurrentInstance } from 'vue'
  const { proxy } = getCurrentInstance()
  const user = reactive({
      state:1
  })
  const userList = ref([])
  const pager = reactive({
      pageNum: 1,
      pageSize: 10,
  })

onMounted(() => {
            getUserList()
        })
        const getUserList = async () => {
            try{
                const {list,page} = await proxy.$api.getUserList(user)
                userList.value = list
                pager.total = page.total
            } catch (error) {
                console.log("error", error);
            }
        }
```
>vue3的this不指向组件实例，我们用proxy来代替this
需要使用 getCurrentInstance() 来获取组件实例。
中 proxy 属性是我们最常用的，它相当于 Vue 2 中的 this，可以用来访问组件的属性和方法。


### 7-4用户删除和批量删除

api/index.js
```js
    userDel(params) {
        return request({
            url: '/users/delete',
            method: 'get',
            data: params
        })
    }
```


这里使用formatter来格式化数据，从数字到具体的状态
User.vue
```js
  const columns = reactive([
  {
    label: '用户ID',
    prop: 'userId',
  },
  {
    label: '用户名',
    prop: 'userName',
  },
  {
    label: '用户邮箱',
    prop: 'userEmail',
  },
  {
    label: '用户角色',
    prop: 'role',
    formatter(row,column,value){
        //这里是一个对象字典
        return {
            0:'管理员',
            1:'普通用户',
        }[value]
    }
  },
  {
    label: '用户状态',
    prop: 'state',
    formatter(row,column,value){
        //这里是一个对象字典
        return {
            1:'在职',
            2:'离职',
            3:'试用期'
        }[value]
    }
  },
```


```js
//用户单个删除
const handleDelete = async (row) => {
    await proxy.$api.userDel({
        userIds: [row.userId]
    })
    proxy.$message.success('删除成功')
    getUserList()
}
//批量删除
const handlePatchDel = async () => {
    if(checkedUserIds.value.length === 0) {
        proxy.$message.error('请选择要删除的用户')
        return
    }
    const res = await proxy.$api.userDel({
        userIds: checkedUserIds.value
    })
    if(res.nModified>0){
        proxy.$message.success('删除成功')
        getUserList()
    }else{
        proxy.$message.error('删除失败')
    }
}
//表格多选
const handleSelectionChange=(list)=>{
    let arr = []
    list.map(item=>{
        arr.push(item.userId)
    })
    checkedUserIds.value = arr
}
```

### 7-5用户新增实现
