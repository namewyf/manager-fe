<template>
  <div class="login-wrapper">
    <div class="modal">
      <!-- 表单中设置 ref 属性很重要，它让我们能够在 JavaScript 代码中方便地操作表单组件。 -->
      <el-form :model="user" status-icon ref="userForm" :rules="rules">
        <div class="title">火星</div>
        <el-form-item prop="userName">
          <el-input type="text" :prefix-icon="User" v-model="user.userName"/>
        </el-form-item>
        <el-form-item prop="userPwd">
          <el-input type="password" :prefix-icon="Lock" v-model="user.userPwd"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn-login" @click="login">登录</el-button>
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
      user:{
        userName:'',
        userPwd:''
      },
      rules:{
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login(){
      this.$refs.userForm.validate((valid) => {
        if(valid){
          this.$api.login(this.user).then((res)=>{
            this.$store.commit('saveUserInfo',res)
            this.$router.push('/welcome')
          })
        }else{
          return false
        }
      })
    },
    gotHome() {
      this.$router.push('/welcome')
    }
  },
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
