<template>
  <el-dialog title="采购清单详情" :visible.sync="dialogVisible" width="80%">
    <el-descriptions title="采购信息" :column="5" :colon="false">
      <el-descriptions-item label="单号">{{ infoData.id }}</el-descriptions-item>
      <el-descriptions-item label="销售经理">{{ infoData.salerName }}</el-descriptions-item>
      <el-descriptions-item label="采购客户">{{ infoData.customerName }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ infoData.customerPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货人">{{ infoData.expressName }}</el-descriptions-item>
      <el-descriptions-item label="收货人电话">{{ infoData.expressPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货人地址">{{ infoData.expressAddress }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">
        <span v-if="infoData.payType === 1">汇款</span>
        <span v-if="infoData.payType === 2">支付宝</span>
        <span v-if="infoData.payType === 3">微信</span>
      </el-descriptions-item>
      <el-descriptions-item label="状态" :span="2">
        <span v-if="infoData.status === 0">未支付</span>
        <span v-if="infoData.status === 1">已支付</span>
        <span v-if="infoData.status === 2">已派单</span>
        <span v-if="infoData.status === 3">已发货</span>
        <span v-if="infoData.status === 4">已收货</span>
      </el-descriptions-item>
      <el-descriptions-item label="下单时间">{{ infoData.createTime }}</el-descriptions-item>
      <el-descriptions-item label="支付时间">{{ infoData.payTime }}</el-descriptions-item>
      <el-descriptions-item label="发货时间">{{ infoData.shipTime }}</el-descriptions-item>
      <el-descriptions-item label="收货时间">{{ infoData.receiveTime }}</el-descriptions-item>
      <el-descriptions-item>
        <span style="padding-right: 10px;">金额</span>
        <span style="font-size: 36px;color: red;font-weight: bold;">{{infoData.totalPrice}}</span>
        <span>元</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-table
        stripe
        :data="infoData.items"
        :height="tableHeight">
      <el-table-column prop="goodsName" label="商品名称" width="280" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="goodsPrice" label="商品单价" width="120"></el-table-column>
      <el-table-column prop="goodsNum" label="商品数量" width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="packName" label="包装" width="100"></el-table-column>
      <el-table-column prop="tasteName" label="口味"></el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
import { getTradeDetail } from "@/api/trade";
import { getSaler } from "@/api/saler";
import { getCustomer } from "@/api/customer";

export default {
  name: "StockTransferInfo",
  data() {
    return {
      dialogVisible: false,
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
      // 请求后端API
      this.isLoading = true
      let { data } = await getTradeDetail({id: this.infoData.id})
      this.infoData = data
      let customerResult = await getCustomer({id: this.infoData.customerId})
      this.infoData.customerName = customerResult.name
      this.infoData.customerPhone = customerResult.phone
      let salerResult = await getSaler({id: this.infoData.salerId})
      this.infoData.salerName = salerResult.name
      // 关闭遮罩层
      this.isLoading = false
    },
  }
}
</script>

<style scoped>

</style>
