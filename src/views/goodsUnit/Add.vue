<template>
  <el-dialog :title="'添加' + title" :visible.sync="dialogVisible">
    <el-form :model="form" label-width="80px" size="small">
      <el-form-item label="名称">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model.number="form.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { saveGoodsBrand } from '@/api/goodsBrand'
import { saveGoodsTaste } from "@/api/goodsTaste";
import { saveGoodsPack } from "@/api/goodsPack";

export default {
  name: "GoodsUnitAdd",
  data() {
    return {
      dialogVisible: false,
      action: 0,
      title: '',
      form: {
        name: '',
        status: 0,
      },
    }
  },
  methods: {
    show(flag, action, title) {
      this.form.name = ''
      this.dialogVisible = flag
      this.action = action
      this.title = title
    },

    // 点击提交按钮的处理方法
    async handleSub() {
      if (!this.form.name) {
        this.$message.error('单位名称不能为空')
        return false
      }
      // 请求后端API更新账户资料
      let reqData = {...this.form}

      switch (this.action) {
        case 1:
          await saveGoodsBrand(reqData)
          break
        case 2:
          await saveGoodsPack(reqData)
          break
        case 3:
          await saveGoodsTaste(reqData)
          break
      }

      // 处理成功
      this.$message.success('添加成功')
      this.dialogVisible = false
      // 刷新列表
      this.$emit("fetch-data")
    },
  }
}
</script>

<style scoped>

</style>
