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
  name: 'Home',
  components: {},
  data() {
    return {
      userInfo:this.$store.state.userInfo,
      noticeCount:0
    }
  },
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
