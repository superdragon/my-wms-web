<template>
  <div v-loading="loading">
    <el-row>
      <el-col :span="6">
        <el-button v-if="checkPermission('role_edit')" size="small" type="primary" icon="el-icon-plus"
                   @click.stop="handleAdd">添加</el-button>
      </el-col>
    </el-row>

    <el-table :data="list" style="width: 100%" stripe size="small" :height="tableHeight">
      <el-table-column prop="name" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="createTime" label="录入时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-if="checkPermission('role_edit')">
            <el-link icon="el-icon-edit" :underline="false" style="font-size: 12px;margin-right: 4px;" type="primary"
                     @click.stop="handleEdit(scope.row)">修改</el-link>
            <el-link icon="el-icon-delete" :underline="false" style="font-size: 12px;" type="danger"
                     @click.stop="handleDel(scope.row)">删除</el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <AddRole ref="add" @fetch-data="fetchData"></AddRole>
    <EditRole ref="edit" @fetch-data="fetchData"></EditRole>
  </div>
</template>

<script>
import AddRole from "@/views/role/Add";
import EditRole from '@/views/role/Edit'
import {findAllRoles, removeRole} from "@/api/role";

export default {
  name: "RoleMgr",
  components: {
    AddRole,
    EditRole,
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(20)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    checkPermission(key) {
      return this.$checkPermission(key)
    },

    async fetchData() {
      const { data } = await findAllRoles()
      this.list = [...data]
    },

    handleAdd() {
      // 弹出Dialog对话框
      this.$refs['add'].show(true)
    },

    handleEdit(item) {
      this.$refs['edit'].show(true, item)
    },

    handleDel(item) {
      let msg = '是否要删除【' + item.name + '】角色?'
      this.$confirm(msg, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeRole({
          id: item.id
        })
        this.$message.success('删除成功')
        this.fetchData()
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
