<template>
  <el-dialog title="添加权限" :visible.sync="dialogVisible">
    <el-tabs type="border-card" @tab-click="handleTab">
      <el-tab-pane label="添加一级权限">
        <el-form :model="form" label-width="80px" size="smaill">
          <el-form-item label="权限名称">
            <el-input v-model.trim="form.title"></el-input>
          </el-form-item>
          <el-form-item label="资源别名">
            <el-input v-model.trim="form.key"></el-input>
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
            <el-button type="primary" @click="handleAdd(1)" style="width: 100%">添  加</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="添加二级权限">
        <el-form :model="form" label-width="120px" size="small">
          <el-form-item label="选择一级权限">
            <el-select v-model.number="form.pid" placeholder="请选择一级权限">
              <el-option v-for="item in oneData" :key="item.id"
                         :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input v-model.trim="form.title"></el-input>
          </el-form-item>
          <el-form-item label="资源别名">
            <el-input v-model.trim="form.key"></el-input>
          </el-form-item>
          <el-form-item label="资源路径">
            <el-input v-model.trim="form.path"></el-input>
          </el-form-item>
          <el-form-item label="排序序号">
            <el-input v-model.number="form.orderNo"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="8">
            <el-button type="primary" @click="handleAdd(2)" style="width: 100%">添  加</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>

      <el-tab-pane label="添加三级权限">
        <el-form :model="form" label-width="120px" size="small">
          <el-form-item label="选择一级权限">
            <el-select v-model.number="form.ppid" placeholder="请选择一级权限" @change="handleChange">
              <el-option v-for="item in oneData" :key="item.id"
                         :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="选择二级权限">
            <el-select v-model.number="form.pid" placeholder="请选择二级权限">
              <el-option v-for="item in twoData" :key="item.id"
                         :label="item.title" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="权限名称">
            <el-input v-model.trim="form.title"></el-input>
          </el-form-item>
          <el-form-item label="资源别名">
            <el-input v-model.trim="form.key"></el-input>
          </el-form-item>
          <el-form-item label="排序序号">
            <el-input v-model.number="form.orderNo"></el-input>
          </el-form-item>
        </el-form>
        <el-row>
          <el-col :span="8" :offset="8">
            <el-button type="primary" @click="handleAdd(3)" style="width: 100%">添  加</el-button>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>

<script>
import {addPermission, getPermissionsByPid} from '@/api/permission'

export default {
  name: "PermissionAdd",
  data() {
    return {
      dialogVisible: false,
      twoData: [],
      oneData: [],
      form: {
        ppid: '',
        pid: '',
        title: '',
        path: '',
        icon: '',
        key: '',
        orderNo: '',
      },
    }
  },
  methods: {
    show(flag) {
      this.dialogVisible = flag
    },

    // 下拉列表发生改变触发
    async handleChange() {
      console.log(this.form)
      // 获取二级权限数据
      if (this.form.ppid) {
        const { data } = await getPermissionsByPid({
          pid: this.form.ppid
        })
        this.twoData = [...data]
      }
    },

    // tab标签被点中的处理函数
    async handleTab(item) {
      // 切换到二三级权限时，重新加载权限最新数据
      if (item.label === '添加二级权限' || item.label === '添加三级权限') {
        this.form.ppid = ''
        this.form.pid = ''
        // 初始化一级权限
        const { data } = await getPermissionsByPid({
          pid: 0
        })
        this.oneData = [...data]
        // 初始化二级权限
        this.twoData = []
      }
    },

    handleAdd(type) {
      // 组装请求数据
      let reqData = {}
      switch (type) {
        case 1:
          reqData.pid = 0
          reqData.key = this.form.key
          reqData.icon = this.form.icon
          reqData.levelId = 1
          reqData.title = this.form.title
          reqData.orderNo = this.form.orderNo
          break;
        case 2:
          reqData.pid = this.form.pid
          reqData.key = this.form.key
          reqData.levelId = 2
          reqData.title = this.form.title
          reqData.path = this.form.path
          reqData.orderNo = this.form.orderNo
          break;
        case 3:
          reqData.pid = this.form.pid
          reqData.key = this.form.key
          reqData.levelId = 3
          reqData.title = this.form.title
          reqData.orderNo = this.form.orderNo
          break;
      }
      addPermission(reqData).then(() => {
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.$emit('fetch-data')
      }).catch()
    },
  }
}
</script>

<style scoped>

</style>
