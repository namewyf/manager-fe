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
// 不过import已经被弃用了ys 的vite-plugin-sass-glob-resolver插件所取代，
// 所以这里不再使用import，而是使用@use，
// @use与@import的区别是，@import会引入所有样式，而@use只会引入用到的样式，
// 所以@use性能更好，但需要使用css变量，
@use "./assets/style/index.scss";
@use "./assets/style/reset.css";
</style>
