<template>
  <div class="login-container" :style="`height:${height}px`">
    <el-row>
      <el-col :span="8" :offset="8" style="margin-top: 200px;">
        <div class="login-plane">
          <h1 class="login-title">{{ appTitle }}</h1>
          <el-form ref="form" :model="form" @keyup.enter.native="subBtnHandler">
            <el-form-item>
              <el-input prefix-icon="el-icon-user" v-model="form.loginName" clearable placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item>
              <el-input prefix-icon="el-icon-key" placeholder="请输入密码" v-model="form.loginPwd" show-password></el-input>
            </el-form-item>
            <el-form-item prop="captchaCode">
              <el-input v-model="form.captchaCode" placeholder="输入验证码"
                        style="width: 270px;"></el-input>
              <img style="width: 110px; margin: -23px 10px;" :src="captchaImg" @click="refreshCaptchaBtnHandler()" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" style="width: 100%;" @click="subBtnHandler" :loading="isLoading">提    交</el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { login } from "@/api/account";
import axios from 'axios'

export default {
  name: "Login",
  data() {
    return {
      isLoading: false,
      captchaImg: '', // 验证码图片地址
      captchaKey: '', // 验证码图片内容对应的唯一ID
      appTitle: process.env.VUE_APP_TITLE,
      baseUrl: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : '',
      form: {
        loginName: this.$store.state.account.loginName,
        loginPwd: '',
        captchaCode: '',
      },
    }
  },
  computed: {
    height() {
      return window.innerHeight
    },
  },
  created() {
    this.refreshCaptchaBtnHandler()
  },
  methods: {
    // 刷新验证码
    refreshCaptchaBtnHandler() {
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
      axios.get(this.baseUrl + '/captcha/render',{responseType: 'arraybuffer'}).then((result) => {
        // 获取 captcha key
        this.captchaKey = result.headers['captcha_key']
        console.log('captchaKey = ' + this.captchaKey)
        // 图片数据流
        const imgData = result.data
        // 生成图片
        this.captchaImg = 'data:image/png;base64,' + btoa(new Uint8Array(imgData).reduce((data, byte) => data + String.fromCharCode(byte), ''))
      }).catch((error) => {
        console.log(error)
      })
    },
    subBtnHandler() {
      if (!this.form.loginName || !this.form.loginPwd) {
        this.$message.error('请输入账号或密码!')
        return
      }
      if (!this.form.captchaCode) {
        this.$message.error('请输入验证码')
        return
      }
      this.isLoading = true
      // 请求后台API验证账户的正确性，并存储到store
      let reqData = {
        name: this.form.loginName,
        password: this.form.loginPwd,
        captchaCode: this.form.captchaCode,
        captchaKey: this.captchaKey,
      }
      login(reqData).then((result) => {
        this.isLoading = false
        this.toHome(result.data)
      }).catch(() => {
        this.refreshCaptchaBtnHandler()
        this.isLoading = false
      })

    },
    async toHome(account) {
      // 把账户信息以及相关的权限信息存储到store中后，再跳转到首页
      await this.$store.dispatch('account/setAccountAction', account)
      // 跳转到首页
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}
.login-container {
  width: 100%;
  height: 730px;
  background: url('~@/assets/background.jpg') center center fixed no-repeat;
  background-size: cover;
}
.login-title {
  text-align: center;
  color: white;
  font-size: 40px;
  padding-bottom: 10px;
}
.login-plane {
  width: 400px;
  margin: 0 auto;
}
</style>
