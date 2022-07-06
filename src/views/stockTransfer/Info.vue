<template>
  <el-dialog title="调拨清单详情" :visible.sync="dialogVisible" width="80%">
    <el-descriptions title="调拨信息" :column="5">
      <el-descriptions-item label="单号">{{ infoData.id }}</el-descriptions-item>
      <el-descriptions-item label="出库仓库">{{ infoData.shipStoreName }}</el-descriptions-item>
      <el-descriptions-item label="出库制表人">{{ infoData.shipEmpName }}</el-descriptions-item>
      <el-descriptions-item label="入库仓库">{{ infoData.receiveStoreName }}</el-descriptions-item>
      <el-descriptions-item label="状态">
        <span v-if="infoData.status === 0" style="color: #409EFF;">配货中</span>
        <span v-if="infoData.status === 1" style="color: #e6a23c;">已发货</span>
        <span v-if="infoData.status === 2" style="color: #67C23A;">已收货</span>
        <span v-if="infoData.status === 3" style="color: #f56c6c;">已取消</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="name" label="商品名称" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="code" label="商品编号" width="100"></el-table-column>
      <el-table-column prop="price" label="商品单价" width="120"></el-table-column>
      <el-table-column prop="goodsNum" label="商品数量" width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="packName" label="包装" width="100"></el-table-column>
      <el-table-column prop="tasteName" label="口味"></el-table-column>
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
  </el-dialog>
</template>

<script>
import { pageTransferItem } from "@/api/transfer";

export default {
  name: "StockTransferInfo",
  data() {
    return {
      dialogVisible: false,
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      infoData: {},
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(300)
    }
  },
  methods: {
    show(flag, item) {
      this.infoData = {...item}
      this.dialogVisible = flag
      this.fetchData()
    },

    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        id: this.infoData.id,
      }
      // 请求后端API
      this.isLoading = true
      let { data } = await pageTransferItem(reqData)
      this.tableData = data.items
      this.pageNum = data.pageNum
      this.pageSize = data.pageSize
      this.totalNum = data.totalNum
      this.isLoading = false
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
  }
}
</script>

<style scoped>

</style>
