<template>
  <el-dialog title="添加账户" :visible.sync="dialogVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" size="mini" style="width: 600px;">
      <el-form-item label="账号" prop="loginName">
        <el-input v-model="form.loginName" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="form.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号码" />
      </el-form-item>
      <el-form-item>
        <el-col :span="18" style="max-width: 330px;">
          <el-upload
              style="margin-top: 10px;"
              action=""
              :before-upload="beforeAvatarUpload"
              :http-request='uploadAvatarBtnHandler'
              :show-file-list="false">
            <el-button size="small" type="primary">点击上传头像</el-button>
            <span style="font-size: 12px;color: #333333;margin-left: 10px;">只能上传jpg/png文件，且不超过500kb</span>
          </el-upload>
        </el-col>
        <el-col :span="6">
          <img v-if="form.avatarUrl" :src="form.avatarUrl" style="width: 50px;height: 50px;">
        </el-col>
      </el-form-item>
      <el-form-item label="登录密码" prop="loginPwd">
        <el-input v-model="form.loginPwd" placeholder="请输入登录密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="checkLoginPwd">
        <el-input v-model="form.checkLoginPwd" placeholder="请再次输入登录密码" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 400px;" @click="handleSub">提     交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {saveAccount} from "@/api/account";
import { uploadImage } from "@/api/file"

export default {
  name: "AccountAdd",
  data() {
    return {
      dialogVisible: false,
      form: {
        avatarUrl: '',
        loginName: '',
        userName: '',
        mobile: '',
        loginPwd: '',
        checkLoginPwd: '',
      },
      rules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 16, message: '长度在 11 到 16 个字符', trigger: 'blur' }
        ],
        loginPwd: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少6位', trigger: 'blur' }
        ],
        checkLoginPwd: [
          { required: true, message: '请再次输入登录密码', trigger: 'blur' },
          { min: 6, message: '密码长度最少6位', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    show(flag) {
      this.dialogVisible = flag
    },

    // 点击提交按钮的处理方法
    handleSub() {
      // this.$refs["form"] 找到对应的表单对象, 值是ref属性的值
      this.$refs["form"].validate((valid) => {
        if (valid) { // 规则验证通过
          // 验证密码和确认密码一致性
          if (this.form.loginPwd !== this.form.checkLoginPwd) {
            this.$message.error('密码和确认密码不一致')
            return false
          }
          // 请求后端API更新账户资料
          let reqData = {...this.form}
          this.loading = true
          saveAccount(reqData).then(() => {
            // 处理成功
            this.$message.success('账户创建成功')
            this.dialogVisible = false
            // 刷新列表
            this.$emit("fetch-data")
          }).catch(() => {
            // 处理失败
          })
        } else { // 规则验证失败
          return false;
        }
      });
    },

    // 上传文件之前的回调函数
    beforeAvatarUpload(file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        this.$message.warning('上传头像图片只能是 JPG 或 PNG 格式!')
        // 阻止错误的文件继续上传
        return false
      }
      return true
    },

    // 准备上传头像的处理函数
    async uploadAvatarBtnHandler(param) {
      // 获取上传文件
      let fileObject = param.file
      // 创建上传表单对象
      let formData = new FormData()
      formData.append("file", fileObject)
      const { data } = await uploadImage(formData)
      this.form.avatarUrl = data
    },
  }
}
</script>

<style scoped>

</style>
