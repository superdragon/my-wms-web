<template>
  <el-dialog title="添加仓库员工" :visible.sync="dialogVisible">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model.trim="form.phone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model.number="form.age" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-radio-group v-model.number="form.gender">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属仓库">
        <el-select v-model.number="form.storeId" placeholder="请选择管辖仓库" style="margin-right: 10px;">
          <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
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
import { listStore } from '@/api/store'
import {updateEmp} from "@/api/employee";

export default {
  name: "EmpEdit",
  data() {
    return {
      dialogVisible: false,
      action: 0,
      form: {
        'name': '',
        'phone': '',
        'age': '',
        'gender': 0,
        'status': 0,
        'storeId': '',
      },
      rules: {
        name: [
          {required: true, message: '请输入员工名称', trigger: 'blur'},
        ],
        phone: [
          {required: true, message: '请输入员工电话', trigger: 'blur'},
        ],
        age: [
          {required: true, message: '请输入员工年龄', trigger: 'blur'},
          {min: 18, max: 100, type: 'number', message: '员工年龄必须在18到50之间', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    this.initStore()
  },
  methods: {
    async initStore() {
      const { data } = await listStore({status: 0})
      this.storeList = data
    },

    show(flag, item) {
      this.form = {...item}
      this.dialogVisible = flag
    },

    // 点击提交按钮的处理方法
    async handleSub() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          let reqData = {...this.form}
          await updateEmp(reqData)
          // 处理成功
          this.$message.success('添加成功')
          this.dialogVisible = false
          // 刷新列表
          this.$emit("fetch-data")
        } else { // 规则验证失败
          return false;
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
