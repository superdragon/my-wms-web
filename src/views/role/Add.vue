<template>
  <el-dialog title="添加角色" :visible.sync="dialogVisible" width="60%">
    <el-input v-model.trim="name" autocomplete="off"
              placeholder="请输入角色名称"></el-input>

    <el-tree ref="tree" :data="data" default-expand-all
             show-checkbox node-key="id" :props="defaultProps"
             style="margin-top: 10px;min-height: 150px; max-height: 300px;overflow: auto;">
    </el-tree>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click.stop="handleSub">添 加</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addRole} from "@/api/role";
import {findAllPermissions} from '@/api/permission'

export default {
  name: "add",
  data() {
    return {
      name: '',
      dialogVisible: false,
      data: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      // 初始化权限树数据
      const {data} = await findAllPermissions()
      this.data = data
    },

    show(flag) {
      this.dialogVisible = flag
    },

    async handleSub() {
      // 校验传给后端数据的有效性
      if (!this.name) {
        this.$message.error('请输入角色名称')
        return
      }
      // 获取权限树上勾选节点
      let nodes = this.$refs['tree'].getCheckedNodes(false, true)
      let permissionIds = []
      // 提取勾选权限节点的id
      nodes.forEach(item => {
        permissionIds.push(item.id)
      })

      await addRole({
        name: this.name,
        permissionIds: permissionIds.join(',')
      })

      this.$message.success('添加成功')
      this.dialogVisible = false
      // 刷新数据
      this.$emit('fetch-data')
    },
  }
}
</script>

<style scoped>

</style>
