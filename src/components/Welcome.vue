<template>
  <div>
    <h1>欢迎来到欢迎界面</h1>
    <!-- <el-button>去登录</el-button> -->
    <router-link to="/login">去登录</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'welcome',
  components: {},
  data() {
    return {}
  },
  methods: {},
  mounted() { }
}
</script>

<style lang="scss" scoped></style>
