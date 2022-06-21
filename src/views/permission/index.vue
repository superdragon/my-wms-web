<template>
  <div v-loading="loading">
    <!-- 工具栏 -->
    <div class="tool-container">
      <el-button type="primary" icon="el-icon-plus"
                 size="medium" style="margin-bottom: 10px;" @click="handleAdd">添加权限</el-button>
    </div>

    <!-- 列表 -->
    <el-table :data="treeData" :height="tableHeight" border size="small"
              row-key="id" default-expand-all :tree-props="{children: 'children'}" style="width: 100%">
      <el-table-column prop="title" label="权限名称" width="200"></el-table-column>
      <el-table-column prop="key" label="资源别名" width="180"></el-table-column>
      <el-table-column prop="path" label="资源路径" width="180"></el-table-column>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.levelId === 1">一级菜单</el-tag>
          <el-tag type="success" v-if="scope.row.levelId === 2">二级菜单</el-tag>
          <el-tag type="info" v-if="scope.row.levelId === 3">三级按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="icon" label="图标" width="80">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="orderNo" label="顺序" width="80"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-if="checkPermission('permission_edit')">
            <el-link @click.native.prevent="handleEdit(scope.row)" type="primary"
                     icon="el-icon-edit" :underline="false" style="font-size: 12px;">编辑</el-link>
            <el-link @click.native.prevent="handleDel(scope.row)" type="danger"
                     icon="el-icon-delete" :underline="false" style="margin-left: 10px;font-size: 12px;">删除</el-link>
          </span>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加对话框 -->
    <PermissionAdd ref="permission_add" @fetch-data="fetchData"></PermissionAdd>

    <!-- 修改对话框 -->
    <PermissionEdit ref="permission_edit" @fetch-data="fetchData"></PermissionEdit>

  </div>
</template>

<script>
import {findAllPermissions, removePermission} from "@/api/permission";
import PermissionAdd from "@/views/permission/Add"
import PermissionEdit from "@/views/permission/Edit"

export default {
  name: "PermissionMgr",
  components: {
    PermissionAdd,
    PermissionEdit,
  },
  data() {
    return {
      loading: false,
      treeData: [], // 权限树数据
      updateFormVisible: false,
      updateForm: {
        id: '',
        name: '',
        sortNum: '',
        icon: '',
        path: '',
      },
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
    // 初始化权限数据
    async fetchData() {
      this.loading = true
      const { data } = await findAllPermissions()
      this.loading = false
      this.treeData = data
    },

    handleAdd() {
      this.$refs['permission_add'].show(true)
    },

    handleEdit(item) {
      this.$refs['permission_edit'].show(true, item)
    },

    handleDel(row) {
      this.$confirm('此操作将永久删除【' + row.title + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const reqData = {
          id: row.id
        }
        removePermission(reqData).then(() => {
          this.$message.success('删除成功')
          this.fetchData()
        }).catch(() => {})
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
