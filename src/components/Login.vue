<template>
  <div>欢迎来到登录界面</div>
  <el-button @click="gotHome()">回首页</el-button>
</template>

<script>
export default {
  name: 'login',
  components: {},
  data() {
    return {}
  },
  methods: {
    gotHome(){
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
    this.$request.get('/login',{name:'jack'}).then((res)=>{
      console.log(res);
    })
  }
}
</script>

<style lang="scss" scoped></style>
