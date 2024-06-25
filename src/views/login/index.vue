<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">RESIM@PKU</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请输入用户名"
          name="username"
          type="text"
          tabindex="1"
          auto-complete="on"
        />
      </el-form-item>

      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :key="passwordType"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          name="password"
          tabindex="2"
          auto-complete="on"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
        </span>
      </el-form-item>

      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px; margin-left: 0px;" @click="registerVisible = true">注册</el-button>
    </el-form>
    <el-dialog title="注册" :visible.sync="registerVisible" class="register-form">
      <el-form ref="registerForm" :model="registerForm" :rules="registerRules" label-width="100px" size="mini">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerForm.email" size="medium" style="width: 65%; margin-right: 5%;"></el-input>
          <el-button type="primary" size="large" style="width: 20%;" @click="sendVerificationCode">获取验证码</el-button>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="registerForm.verificationCode" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="registerForm.password" size="medium"></el-input>
        </el-form-item>
        <!-- 验证密码 -->
        <el-form-item label="确认密码" prop="confirm">
          <el-input v-model="confirmPassword" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="registerForm.username" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="registerForm.realName" size="medium"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="large" @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { autoLogin } from '@/api/user'
import { login, register, sendVerificationCode } from '@/api/user'

export default {
  name: 'Login',
  data() {
    return {
      registerVisible: false,
      captcha: '',
      loginForm: {
        username: '',
        password: '',
      },
      sendCodeForm: {
        email: ''
      },
      loginRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      registerForm: {
        email: '', 
        verificationCode: '',
        password: '',
        username: '',
        realName: ''
      },
      confirmPassword: '',
      registerRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    isPasswordValid() {
      return this.registerForm.password === this.confirmPassword
    }
  },
  created(){
    // autoLogin(this.$store.getters.token).then(res => {
    //   if(res.data.code === 200){
    //     this.$router.push({ path: this.redirect || '/' })
    //   }
    // })
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    sendVerificationCode() {
      this.sendCodeForm.email = this.registerForm.email
      sendVerificationCode(this.sendCodeForm).then(res => {
        if(res.data.code === 200){
          this.$message({
            message: '验证码发送成功',
            type: 'success'
          })
        }
      })
    },
    handleRegister() {
      if(!this.isPasswordValid){
        this.$message({
          message: '两次密码输入不一致',
          type: 'error'
        })
        return
      }
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          register(this.registerForm).then(res => {
            if(res.data.code === 200){
              this.$message({
                message: '注册成功',
                type: 'success'
              })
              this.registerVisible = false
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss">

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;
// $bg:#2d3a4b;
$light_gray:#eee;
$register_bg:#ffffff; // 白色背景
$register_input_bg:#ffffff; // 输入框白色背景
$register_input_border:#dcdcdc; // 输入框边框颜色

@supports (-webkit-mask: none) and (not (caret-color: $cursor)) {
  .login-container {
    input {
      color: $cursor;
    }
  }
}


.login-container { 

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;  
  }

  .register-form {
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: #fff;
      border-radius: 5px;
      color: #454545; 
      margin-bottom: 20px;
      label {
        color: grey; // 标签颜色改为深灰色
        font-size: 16px;
      }

      .el-input {
        input {
          background-color: $register_input_bg;
          color: grey; // 输入框文字颜色改为深灰色
          border: 1px solid $register_input_border; // 输入框边框颜色
          border-radius: 5px;
          padding: 10px;
          font-size: large;
        }
      }
    }    
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$register_bg:#ffffff; // 白色背景
$register_input_bg:#ffffff; // 输入框白色背景
$register_input_border:#dcdcdc; // 输入框边框颜色

.login-container {
  // ...existing styles...

  .el-dialog {
    .el-form {
      background-color: $register_bg;
      border-radius: 5px;
      padding: 20px;

      .el-form-item {
        margin-bottom: 20px;
        label {
          color: $dark_gray; // 标签颜色改为深灰色
          font-size: 16px;
        }

        .el-input {
          input {
            background-color: $register_input_bg;
            color: $dark_gray; // 输入框文字颜色改为深灰色
            border: 1px solid $register_input_border; // 输入框边框颜色
            border-radius: 5px;
            padding: 10px;
          }
        }
      }
    }
  }
}
</style>