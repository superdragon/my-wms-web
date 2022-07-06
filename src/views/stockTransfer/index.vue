<template>
  <div v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button type="primary" v-if="checkPermission('stock_transfer_add')" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
      </el-col>

      <el-col :span="22">
        <el-select v-model.number="filterFrom.shipStoreId" clearable placeholder="请选择发货仓库" size="small" style="margin-right: 10px;">
          <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-select v-model.number="filterFrom.receiveStoreId" clearable placeholder="请选择收货仓库" size="small" style="margin-right: 10px;">
          <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-input placeholder="请输入调拨单号" v-model="filterFrom.id" clearable size="small"
                  style="width: 300px;margin-right: 10px;"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      </el-col>
    </el-row>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="id" label="调拨单号" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="shipStoreName" label="发货仓库" width="120"></el-table-column>
      <el-table-column prop="receiveStoreName" label="收货仓库" width="120"></el-table-column>
      <el-table-column prop="shipEmpName" label="发货制单人" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 0">配货中</el-tag>
          <el-tag type="warning" v-if="scope.row.status === 1">已发货</el-tag>
          <el-tag type="success" v-if="scope.row.status === 2">已收货</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 3">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="shipTime" label="发货时间" width="180"></el-table-column>
      <el-table-column prop="receiveTime" label="收货时间" width="180"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
      <el-table-column label="操作"  fixed="right" width="280">
        <template slot-scope="scope">
          <el-button size="mini" plain icon="el-icon-info" type="primary" style="margin-right: 10px;" @click="handleInfo(scope.row)">详情</el-button>
          <span v-if="checkPermission('stock_transfer_edit')">
            <el-button v-if="scope.row.status === 0" size="mini" plain icon="el-icon-sold-out" type="warning" @click="handleTransfer(scope.row, 1)">发货</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" plain icon="el-icon-sell" type="success" @click="handleTransfer(scope.row, 2)">收货</el-button>
            <el-button v-if="scope.row.status === 0 || scope.row.status === 1" size="mini" plain icon="el-icon-refresh-left" type="danger" @click="handleCancel(scope.row)">取消</el-button>
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

    <StockTransferAdd ref="stockTransferAdd" @fetch-data="fetchData"></StockTransferAdd>
    <StockTransferInfo ref="stockTransferInfo"></StockTransferInfo>
  </div>
</template>

<script>
import {listStore} from "@/api/store";
import { pageTransferList, updateTransferStatus } from '@/api/transfer'
import StockTransferAdd from '@/views/stockTransfer/Add'
import StockTransferInfo from '@/views/stockTransfer/Info'

export default {
  name: "StockTransfer",
  components: {
    StockTransferAdd,
    StockTransferInfo,
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      storeList: [],
      startStoreId: '',
      endStoreId: '',
      filterFrom: {
        id: '',
        shipStoreId: '',
        receiveStoreId: '',
      },
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(60)
    }
  },
  created() {
    // 获取地址携带的参数
    const storeId = this.$route.query.storeId
    if (storeId) {
      this.filterFrom.shipStoreId = storeId - 0
    }
    this.initStore()
    // 初始化数据
    this.fetchData()
  },
  methods: {
    checkPermission(key) {
      return this.$checkPermission(key)
    },

    async initStore() {
      const { data } = await listStore({status: 0})
      this.storeList = data
    },

    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      // 如果模糊查询关键字有值
      if (this.filterFrom.id) {
        reqData.id = this.filterFrom.id
      }
      if (this.filterFrom.shipStoreId) {
        reqData.shipStoreId = this.filterFrom.shipStoreId
      }
      if (this.filterFrom.receiveStoreId) {
        reqData.receiveStoreId = this.filterFrom.receiveStoreId
      }
      let result = await pageTransferList(reqData)
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

    handleAdd() {
      this.$refs['stockTransferAdd'].show(true)
    },

    handleQuery() {
      this.fetchData()
    },

    handleInfo(item) {
      this.$refs['stockTransferInfo'].show(true, item);
    },

    async handleTransfer(row, status) {
      let message = '确定要修改订单【' + row.id + '】的状态吗?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 请求后端API
        let reqData = {
          id: row.id,
          status,
        }
        this.isLoading = true
        await updateTransferStatus(reqData)
        this.isLoading = false
        this.fetchData()
      }).catch(() => {});
    },

    handleCancel(row) {
      let message = '确定要取消订单【' + row.id + '】吗?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 请求后端API
        let reqData = {
          id: row.id,
          status: 3,
        }
        this.isLoading = true
        await updateTransferStatus(reqData)
        this.isLoading = false
        this.fetchData()
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
