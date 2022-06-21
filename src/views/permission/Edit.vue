<template>
  <el-dialog title="修改权限" :visible.sync="dialogVisible">
    <el-form :model="form" label-width="80px" size="small">
      <el-form-item label="权限等级">
        <el-select v-model.number="form.levelId" disabled>
          <el-option label="一级菜单" :value="1"></el-option>
          <el-option label="二级菜单" :value="2"></el-option>
          <el-option label="三级按钮" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="权限名称">
        <el-input v-model.trim="form.title"></el-input>
      </el-form-item>
      <el-form-item label="资源别名">
        <el-input v-model.trim="form.key"></el-input>
      </el-form-item>
      <el-form-item label="资源路径">
        <el-input v-model.trim="form.path" :disabled="form.levelId !== 2"></el-input>
      </el-form-item>
      <el-form-item label="菜单图标">
        <el-input v-model.trim="form.icon"></el-input>
      </el-form-item>
      <el-form-item label="排序序号">
        <el-input v-model.number="form.orderNo"></el-input>
      </el-form-item>
    </el-form>
    <el-row>
      <el-col :span="8" :offset="8">
        <el-button type="primary" @click="handleEdit" style="width: 100%">修  改</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import {updatePermission} from '@/api/permission'

export default {
  name: "PermissionEdit",
  data() {
    return {
      dialogVisible: false,
      form: {
        id: '',
        title: '',
        path: '',
        icon: '',
        key: '',
        orderNo: '',
      },
    }
  },
  methods: {
    show(flag, item) {
      this.dialogVisible = flag
      this.form = {...item}
    },

    handleEdit() {
      const reqData = {...this.form}
      updatePermission(reqData).then(() => {
        this.$message.success('修改成功')
        this.dialogVisible = false
        this.$emit('fetch-data')
      }).catch(() => {})
    },
  }
}
</script>

<style scoped>

</style>
