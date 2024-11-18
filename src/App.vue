<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'app'
}
</script>


<style lang="scss">
/* style样式要通过@import的方式进行引入 */
@use "./assets/style/index.scss";
@use "./assets/style/reset.css";
</style>
