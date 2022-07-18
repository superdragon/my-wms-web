<template>
  <el-dialog title="采购订单" :visible.sync="dialogVisible" width="80%">
    <el-select v-model="form.storeId" @change="handleChange" placeholder="请选择仓库" style="margin-right: 10px;">
      <el-option v-for="item in storeList" :key="item.id + 'store'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.empId" placeholder="请选择制表人" style="margin-right: 10px;">
      <el-option v-for="item in empList" :key="item.id + 'emp'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-button type="primary" @click="handleStore">匹配仓库</el-button>

    <el-divider content-position="left">订单信息</el-divider>

    <el-descriptions title="采购信息" :column="5">
      <el-descriptions-item label="单号">{{ infoData.id }}</el-descriptions-item>
      <el-descriptions-item label="销售经理">{{ infoData.salerName }}</el-descriptions-item>
      <el-descriptions-item label="采购客户">{{ infoData.customerName }}</el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ infoData.customerPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货人">{{ infoData.expressName }}</el-descriptions-item>
      <el-descriptions-item label="收货人电话">{{ infoData.expressPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货人地址">{{ infoData.expressAddress }}</el-descriptions-item>
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
      <el-table-column prop="storeNum" label="仓库余量"></el-table-column>
      <el-table-column prop="isOk" label="是否满足">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.isOk === false">不足</el-tag>
          <el-tag type="primary" v-if="scope.row.isOk === true">充足</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub" :disabled="subDisable">发 货</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {listStore} from "@/api/store";
import {listEmp} from "@/api/employee";
import {getTradeDetail, checkStoreTrade, goodsOutTrade} from "@/api/trade";
import {getCustomer} from "@/api/customer";
import {getSaler} from "@/api/saler";

export default {
  name: "GoodsShipped",
  data() {
    return {
      subDisable: true,
      dialogVisible: false,
      form: {
        storeId: '', // 仓库
        empId: '', // 制表人
      },
      storeList: [], // 所有仓库
      empList: [], // 仓库对应员工
      infoData: {},
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(400)
    }
  },
  created() {
    // 初始化数据
    this.fetchData()
  },
  methods: {
    async show(flag, trade) {
      // 获取订单详情
      let tradeResult = await getTradeDetail({id: trade.id})
      this.infoData = tradeResult.data

      let customerResult = await getCustomer({id: trade.customerId})
      if (customerResult.data) {
        this.infoData.customerName = customerResult.data.name
        this.infoData.customerPhone = customerResult.data.phone
      }

      let salerResult = await getSaler({id: trade.salerId})
      if (salerResult.data) {
        this.infoData.salerName = salerResult.data.name
      }

      this.dialogVisible = flag
    },

    async fetchData() {
      // 获取所有仓库数据
      let storeListResult = await listStore({status: 0})
      this.storeList = storeListResult.data
    },

    // 选择仓库时触发的方法
    async handleChange(id) {
      // 获取对应仓库的员工
      let { data } = await listEmp({storeId: id})
      this.empList = data
      this.form.empId = ''
    },

    async handleStore() {
      if (!this.form.storeId) {
        this.$message.error('请选择仓库')
        return
      }
      if (!this.form.empId) {
        this.$message.error('请选择制表人')
        return
      }

      let items = []
      this.infoData.items.forEach(item => {
        items.push({
          goodsId: item.goodsId,
          goodsNum: item.goodsNum,
        })
      })

      let reqData = {
        storeId: this.form.storeId,
        items,
      }
      let flag = true;
      const { data } = await checkStoreTrade(reqData)
      this.infoData.items.map(item => {
        // 避免数组中对象有新增属性，页面不渲染问题
        this.$set(item, 'storeNum', data[item.goodsId].storeNum);
        this.$set(item, 'isOk', data[item.goodsId].isOk);
        flag = flag && !data[item.goodsId].isOk
        return item
      })
      this.subDisable = flag
    },

    async handleSub() {
      await goodsOutTrade({
        tradeId: this.infoData.id,
        storeId: this.form.storeId,
        empId: this.form.empId,
      })

      this.$message.success('发货成功')
      this.dialogVisible = false
      this.$emit('fetch-data')
    }
  }
}
</script>

<style scoped>

</style>
