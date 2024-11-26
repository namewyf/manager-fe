<template>
  <div class="basic-layout">
    <!-- 导航栏 -->
    <div :class="['nav-side', isCollapse ? 'fold' : 'unfold']">
      <!-- 系统logo -->
      <div class="logo">
        <img src="./../assets/logo.png" alt="">
        <span>Manager</span>
      </div>
      <!-- 导航菜单 -->
      <el-menu :default-active="activeMenu" background-color="#001529" text-color="#fff" router :collapse="isCollapse"
        class="nav-menu">
        <TreeMenu :userMenu="userMenu"></TreeMenu>
      </el-menu>
    </div>
    <!-- 右侧内容 -->
    <div :class="['content-right', isCollapse ? 'fold' : 'unfold']">
      <!-- 顶部导航栏 -->
      <div class="nav-top">
        <div class="nav-left">
          <div class="menu-fold" @click="toggle">
            <el-icon>
              <Operation />
            </el-icon>
          </div>
          <div class="bread">
            <BreadCrumb></BreadCrumb>
          </div>
        </div>

        <div class="user-info">
          <el-badge :is-dot="noticeCount > 0 ? true : false" class="notice">
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
import BreadCrumb from './BreadCrumb.vue';
import TreeMenu from './TreeMenu.vue';
export default {
  name: 'home',
  components: {
    TreeMenu,
    BreadCrumb
  },
  data() {
    return {
      userInfo: this.$store.state.userInfo,
      noticeCount: 0,
      userMenu: [],
      isCollapse: false,
      activeMenu: location.hash.slice(1)//location.hash可以获取到当前路由地址
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
    },
    async getNoticeCount() {
      try {
        const count = await this.$api.getNoticeCount()
        this.noticeCount = count
      } catch (error) {
        console.error(error);
      }
    },
    async getMenuList() {
      try {
        const list = await this.$api.getMenuList()
        this.userMenu = list
      } catch (error) {
        console.error(error);
      }
    }
  },
  mounted() {
    this.getNoticeCount()
    this.getMenuList()
  }
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
    overflow-x: hidden;
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

    //在 SCSS 中，& 符号代表当前父选择器。当你在一个嵌套的选择器中使用 & 时，它会将父选择器与子选择器组合在一起。
    //合并
    &.fold {
      width: 64px;
    }

    //展开
    &.unfold {
      width: 200px;
    }
  }

  .content-right {
    margin-left: 200px;

    &.fold {
      margin-left: 64px;
    }

    &.unfold {
      margin-left: 200px;
    }

    .nav-top {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between; //控制两段对齐
      border-bottom: 1px solid #ddd;
      padding: 0 20px;

      .nav-left {
        display: flex;
        align-items: center;

        .menu-fold {
          margin-right: 15px;
          font-size: 18px;
        }
      }

      .user-info {
        display: flex;
        align-items: center;

        .notice {
          line-height: 30px;
          margin-right: 15px;
        }

        .user-link {
          cursor: pointer;
          color: #409eff;
          display: flex;
          align-items: center;
        }
      }
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
