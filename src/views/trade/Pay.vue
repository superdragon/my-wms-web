<template>
  <el-dialog title="模拟支付成功" :visible.sync="dialogVisible" width="50%">
    <el-descriptions title="采购信息" :column="2" :colon="false">
      <el-descriptions-item label="单号">{{ trade.id }}</el-descriptions-item>
      <el-descriptions-item label="支付方式">
        <span v-if="trade.payType === 1">汇款</span>
        <span v-if="trade.payType === 2">支付宝</span>
        <span v-if="trade.payType === 3">微信</span>
      </el-descriptions-item>
      <el-descriptions-item label="金额" labelClassName="label-style">
        <span style="font-size: 36px;color: red;font-weight: bold;">{{trade.totalPrice}}</span>
        <span>元</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-input v-if="trade.payType === 1" placeholder="请输入汇款单号" v-model="moneyOrder">
      <template slot="prepend">汇款单号</template>
    </el-input>

    <img v-if="trade.payType === 2 || trade.payType === 3" :src="baseURL + 'qrcode.png'" width="180px" />

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">支付成功</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {payTrade} from "@/api/trade";

export default {
  name: "pay",
  data() {
    return {
      baseURL: process.env.BASE_URL,
      trade: '',
      dialogVisible: false,
      moneyOrder: ''
    }
  },
  methods: {
    show(flag, item) {
      this.trade = {...item}
      this.dialogVisible = flag
    },

    handleSub() {
      if (this.trade.payType === 1 && !this.moneyOrder) {
        this.$message.error('请输入汇款单号')
        return
      }

      this.$confirm('确定客户已经支付成功？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {

        await payTrade({
          id: this.trade.id,
          moneyOrder: this.moneyOrder,
        })

        this.$message({
          type: 'success',
          message: '提交成功!'
        });

        this.dialogVisible = false
        this.$emit('fetch-data')
      }).catch(() => {});
    },
  }
}
</script>

<style>
.label-style {
  margin-top: 22px;
}
</style>
