<template>
  <el-dialog title="修改角色" :visible.sync="dialogVisible" width="60%">
    <el-input v-model.trim="name" autocomplete="off"
              placeholder="请输入角色名称"></el-input>

    <el-tree ref="tree" :data="data" default-expand-all
             show-checkbox node-key="id"
             :props="defaultProps" style="margin-top: 10px;min-height: 300px;">
    </el-tree>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click.stop="handleSub">修 改</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {getPermission, updateRole} from "@/api/role";
import {findAllPermissions} from '@/api/permission'

export default {
  name: "add",
  data() {
    return {
      name: '',
      dialogVisible: false,
      data: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'title'
      },
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

    async show(flag, role) {
      this.dialogVisible = flag
      this.name = role.name
      this.roleId = role.id
      const {data} = await getPermission({
        id: role.id,
      })
      // 取消所有勾选项
      this.$refs['tree'].setCheckedKeys([])
      data.permissions.forEach(item => {
        // 勾选默认的权限节点
        this.$refs['tree'].setChecked(item.id, true)
      })
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
      await updateRole({
        id: this.roleId,
        name: this.name,
        permissionIds: permissionIds.join(',')
      })
      this.$message.success('修改成功')
      this.dialogVisible = false
      // 刷新数据
      this.$emit('fetch-data')
    },
  }
}
</script>

<style scoped>

</style>
