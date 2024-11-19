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
import { markRaw } from 'vue';

export default {
  name: 'login',
  components: {},
  data() {
    return {
      User:markRaw(User),
      Lock:markRaw(Lock),
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
