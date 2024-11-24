<template>
  <div class="basic-layout">
    <!-- 导航栏 -->
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
    <!-- 右侧内容 -->
    <div class="content-right">
      <!-- 顶部导航栏 -->
      <div class="nav-top">
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
  components: {
  },
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
    transition: width 0.5s; //宽度变化的动画

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
  }

  .content-right {
    margin-left: 200px;

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between; //控制两段对齐
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
