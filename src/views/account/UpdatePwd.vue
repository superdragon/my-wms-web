<template>
  <el-dialog title="更新密码" :visible.sync="dialogVisible">
    <el-form :model="form" ref="form" label-width="80" size="small">
      <el-form-item label="账号">
        <el-input v-model="form.loginName" disabled autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.loginPwd" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.checkPwd" autocomplete="off"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {updateNewPwd} from "@/api/account";

export default {
  name: "UpdatePwd",
  data() {
    return {
      dialogVisible: false,
      form: {
        id: '',
        loginName: '',
        loginPwd: '',
        checkPwd: '',
      },
    }
  },
  methods: {
    show(flag, item) {
      this.dialogVisible = flag
      this.form.id = item.id
      this.form.loginName = item.loginName
    },
    async handleSub() {
      //验证密码和确认密码一致性
      if (this.form.loginPwd !== this.form.checkPwd) {
        this.$message.error('密码和确认密码不一致')
        return false
      }
      let reqData = {
        id: this.form.id,
        newLoginPwd: this.form.loginPwd,
        checkNewLoginPwd: this.form.checkPwd,
      }
      await updateNewPwd(reqData)
      this.$message.success('更新密码成功')
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped>

</style>
