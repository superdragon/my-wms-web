<template>
  <div v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :span="18">
        <el-input placeholder="订货单号" v-model="filterFrom.id" clearable size="small"
                  style="width: 300px;margin-right: 10px;"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      </el-col>
    </el-row>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="id" label="订货单号" width="230" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="totalPrice" label="订单金额" width="120"></el-table-column>
      <el-table-column prop="payType" label="支付方式" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.payType === 1">汇款</el-tag>
          <el-tag v-if="scope.row.payType === 2">支付宝</el-tag>
          <el-tag v-if="scope.row.payType === 3">微信</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="订单状态" width="100">
        <template slot-scope="scope">
          <el-tag type="info" v-if="scope.row.status === 0">未支付</el-tag>
          <el-tag type="danger" v-if="scope.row.status === 1">已支付</el-tag>
          <el-tag type="warning" v-if="scope.row.status === 2">已派单</el-tag>
          <el-tag type="primary" v-if="scope.row.status === 3">已发货</el-tag>
          <el-tag type="success" v-if="scope.row.status === 4">已收货</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="payTime" label="支付时间" width="180"></el-table-column>
      <el-table-column prop="createTime" label="下单时间" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" icon="el-icon-truck" @click="handleStatus(scope.row)">接单</el-button>
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

    <shipped ref="shipped" @fetch-data="fetchData"></shipped>
  </div>
</template>

<script>
import { pageTrade } from "@/api/trade";
import shipped from "@/views/goodsOut/shipped";

export default {
  name: "TradeMgr",
  components: {
    shipped,
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      filterFrom: {
        id: '',
      },
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(60)
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
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        status:  2,
      }
      // 如果模糊查询关键字有值
      if (this.filterFrom.id) {
        reqData.id = this.filterFrom.id
      }
      let result = await pageTrade(reqData)
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

    handleQuery() {
      this.fetchData()
    },

    handleStatus(row) {
      this.$refs['shipped'].show(true, row)
    },
  }
}
</script>

<style scoped>

</style>
