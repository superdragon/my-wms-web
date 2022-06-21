<template>
  <div v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button v-if="checkPermission('account_add')" type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
        <el-button v-if="checkPermission('account_edit')" type="danger" icon="el-icon-delete" size="small" @click="handlerBatchDel">删除</el-button>
        <el-button type="warning" icon="el-icon-download" size="small" @click="exportCSV">导出</el-button>
      </el-col>

      <el-col :span="8">
        <el-upload
            v-if="checkPermission('account_add')"
            action=""
            :before-upload="beforeUpload"
            :http-request='uploadBtnHandler'
            :show-file-list="false">
          <el-button size="small" type="primary">点击上传CSV</el-button>
          <span style="font-size: 12px;margin-left: 10px;">{{ csvName }}</span>
        </el-upload>
      </el-col>

      <el-col :span="8">
        <el-input placeholder="账户/手机号" v-model="filterFrom.keyWord" clearable size="small" style="width: 300px;margin-right: 10px;"></el-input>
        <el-button type="primary" icon="el-icon-delete" size="small" @click="handleFilter">查询</el-button>
      </el-col>
    </el-row>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight"
        style="margin-top: 10px;"
        size="small"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="id" label="编号" width="80"></el-table-column>
      <el-table-column prop="imageUrl" label="头像" width="80">
        <template slot-scope="scope">
          <el-avatar :size="50" :src="scope.row.avatarUrl"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="loginName" label="账号" width="100"></el-table-column>
      <el-table-column prop="userName" label="名称" width="100"></el-table-column>
      <el-table-column prop="mobile" label="手机号" width="120"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="90"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="90"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="checkPermission('account_edit')" size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="checkPermission('account_edit')" size="mini" plain icon="el-icon-lock" type="primary" @click="handleRole(scope.row)">角色</el-button>
          <el-button v-if="checkPermission('account_edit')" size="mini" plain icon="el-icon-delete" type="danger" @click="handleDel(scope.row)">删除</el-button>
          <el-button v-if="checkPermission('account_edit')" size="mini" plain icon="el-icon-key" type="danger" @click="handleUpdatePwd(scope.row)">更新密码</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        style="margin-top: 10px;"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[5, 10, 20, 50, 100]"
        :current-page="pageNum"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        :total="totalNum">
    </el-pagination>

    <!-- 更新密码 -->
    <UpdatePwd ref="updatePwd"></UpdatePwd>

    <!-- 添加账户 -->
    <AccountAdd ref="accountAdd" @fetch-data = "fetchData"></AccountAdd>

    <!-- 编辑账户 -->
    <AccountEdit ref="accountEdit" @fetch-data = "fetchData"></AccountEdit>

    <!-- 编辑账户角色 -->
    <AccountRole ref="accountRole"></AccountRole>
  </div>
</template>

<script>
import { findAccounts, removeAccounts, uploadCsv } from '@/api/account'
import UpdatePwd from "@/views/account/UpdatePwd";
import AccountAdd from "@/views/account/Add"
import AccountEdit from "@/views/account/Edit"
import AccountRole from "@/views/account/Role"

export default {
  name: "AccountMgr",
  components: {
    UpdatePwd,
    AccountAdd,
    AccountEdit,
    AccountRole,
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      filterFrom: {
        keyWord: '',
      },
      selected: [],
      serverUrl: process.env.VUE_APP_SERVER_URL,
      csvName: "",
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(60)
    }
  },
  created() {
    // 初始化数据
    this.fetchData()
  },
  methods: {
    checkPermission(key) {
      return this.$checkPermission(key)
    },
    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        keyWord: this.filterFrom.keyWord,
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      let result = await findAccounts(reqData)
      this.pageNum = result.data.pageNum
      this.pageSize = result.data.pageSize
      this.totalNum = result.data.totalNum
      this.tableData = result.data.items
      // 关闭遮罩层
      this.isLoading = false
    },

    handleRole(item) {
      this.$refs['accountRole'].show(true, item)
    },

    // 点击添加按钮的回调函数
    handleAdd() {
      this.$refs['accountAdd'].show(true)
    },

    // 批量选择的回调函数
    handleSelectionChange(rows) {
      this.selected = rows
    },

    // 每页显示的最大记录数发生改变时会被调用
    handleSizeChange(ps) {
      this.pageSize = ps
      this.fetchData()
    },

    // 当前页面发生改变时会被调用
    handleCurrentChange(pn) {
      this.pageNum = pn
      this.fetchData()
    },

    // 点击批删按钮的回调函数
    handlerBatchDel() {
      if (this.selected.length <= 0) {
        this.$message.error('请选择要删除的记录!')
        return false
      }
      let content = '是否要删除这些账号?'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchDel()
      }).catch(() => {});
    },

    // 点击编辑按钮的回调函数
    handleEdit(row) {
      this.$refs['accountEdit'].show(true, row)
    },

    // 点击删除按钮的回调函数
    handleDel(row) {
      let content = '是否要删除【' + row.loginName + '】账号?'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.selected = [row]
        this.batchDel()
      }).catch(() => {});
    },

    async batchDel() {
      let data = [...this.selected]
      let idArr = []
      for (let i = 0; i < data.length; i++) {
        idArr.push(data[i].id)
      }
      let reqData = {
        ids: idArr.join(',') // 1,2,3
      }
      this.isLoading = true
      await removeAccounts(reqData)
      setTimeout(() => {
        this.isLoading = false
        this.fetchData()
      }, 500)
    },

    // 点击过滤查询按钮的回调函数
    handleFilter() {
      this.fetchData()
    },

    // 点击更新密码按钮的回调函数
    handleUpdatePwd(row) {
      // 弹出Dialog对话框
      this.$refs['updatePwd'].show(true, row)
    },

    exportCSV() {
      window.location = this.serverUrl + '/account/exportCsv?keyWord=' + this.filterFrom.keyWord
    },

    // 上传文件之前的回调函数
    beforeUpload(file) {
      if (file.type !== 'application/vnd.ms-excel') {
        this.$message.warning('上传文件类型不正确!')
        // 阻止错误的文件继续上传
        return false
      }
      this.csvName = file.name
      return true
    },

    // 准备上传的处理函数
    async uploadBtnHandler(param) {
      // 获取上传文件
      let fileObject = param.file
      // 创建上传表单对象
      let formData = new FormData()
      formData.append("file", fileObject)
      const { data } = await uploadCsv(formData)
      this.form.imageUrl = data
    },
  }
}
</script>

<style scoped>

</style>
