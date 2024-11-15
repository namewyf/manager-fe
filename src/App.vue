<template>
  <router-view></router-view>
</template>

<script>
  export default{
    name:'app',
    mounted(){
      this.$storage.setItem('name','Tom')
    }
  }
</script>


<style scoped>

</style>
