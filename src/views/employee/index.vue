<template>
  <div v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button type="primary" icon="el-icon-plus" v-if="checkPermission('emp_add')" size="small" @click="handleAdd">添加</el-button>
      </el-col>

      <el-col :span="18">
        <el-input placeholder="员工名称/联系电话" v-model="filterFrom.keyWord" clearable size="small"
                  style="width: 500px;margin-right: 10px;"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      </el-col>
    </el-row>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="name" label="名称" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="phone" label="联系电话" width="120"></el-table-column>
      <el-table-column prop="storeName" label="仓库" width="140"></el-table-column>
      <el-table-column prop="age" label="年龄" width="80"></el-table-column>
      <el-table-column prop="gender" label="性别" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.gender === 1">女</el-tag>
          <el-tag v-if="scope.row.gender === 0">男</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 0">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <span v-if="checkPermission('emp_edit')">
            <el-button size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑
            </el-button>
            <el-button v-if="scope.row.status === 1" size="mini" plain icon="el-icon-check" type="primary"
                       @click="handleEnable(scope.row, 0)">启用
            </el-button>
            <el-button v-if="scope.row.status === 0" size="mini" plain icon="el-icon-close" type="danger"
                       @click="handleEnable(scope.row, 1)">禁用
            </el-button>
          </span>
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

    <EmpAdd ref="empAdd" @fetch-data="fetchData"></EmpAdd>
    <EmpEdit ref="empEdit" @fetch-data="fetchData"></EmpEdit>
  </div>
</template>

<script>
import { pageEmp, updateEmp } from '@/api/employee'
import EmpAdd from '@/views/employee/Add'
import EmpEdit from '@/views/employee/Edit'

export default {
  name: "EmpMgr",
  components: {
    EmpAdd,
    EmpEdit,
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
      }
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
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      if (this.filterFrom.keyWord) {
        reqData.name = this.filterFrom.keyWord
      }
      let result = await pageEmp(reqData)
      this.pageNum = result.data.pageNum
      this.pageSize = result.data.pageSize
      this.totalNum = result.data.totalNum
      this.tableData = result.data.items
      // 关闭遮罩层
      this.isLoading = false
    },

    handleSizeChange(ps) {
      this.pageSize = ps
      this.fetchData()
    },
    handleCurrentChange(pn) {
      this.pageNum = pn
      this.fetchData()
    },

    handleEnable(row, stauts) {
      let message = '你确定要更新【' + row.name + '】的状态吗?'
      let reqData = {
        id: row.id, // 仓库ID
        status: stauts, // 更新状态
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await updateEmp(reqData)
        this.fetchData()
      }).catch(() => {});
    },

    handleEdit(item) {
      this.$refs['empEdit'].show(true, item)
    },

    handleAdd() {
      this.$refs['empAdd'].show(true)
    },

    handleQuery() {
      this.fetchData()
    },
  }
}
</script>

<style scoped>

</style>
