<template>
  <div class="welcome">
    <h1>欢迎来到主界面</h1>
    <router-link to="/login">去登录</router-link>
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

<style lang="scss" scoped>
.welcome {
  background: #fff;
  height: 100%;
}
</style>
