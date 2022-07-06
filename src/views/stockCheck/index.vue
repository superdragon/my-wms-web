<template>
  <div v-loading="isLoading" :style="{height: divHeight + 'px',overflow: 'auto'}" class="card-container">
    <el-card v-for="item in statData" :key="item.id" class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">{{ item.storeName }}</span>
        <span v-if="item.storeStatus === 0" style="float: right; padding: 3px 0; color: blue">启用中</span>
        <span v-if="item.storeStatus === 1" style="float: right; padding: 3px 0; color: red">已停用</span>
      </div>
      <div class="text item"><span class="el-icon-goods">商品种类:</span><span class="stat">{{ item.goodsStat }}</span></div>
      <div class="text item"><span class="el-icon-sell">累计入库总量:</span><span class="stat">{{ item.inStockStat }}</span><span>件</span></div>
      <div class="text item"><span class="el-icon-sold-out">累计出库总量:</span><span class="stat">{{ item.outStockStat }}</span><span>件</span></div>
      <div class="text item"><span class="el-icon-box">当前库存总量:</span><span class="stat">{{ item.stockStat }}</span><span>件</span></div>
      <div class="text item"><span class="el-icon-position">待库存总量:</span><span class="stat">{{ item.outtingStockStat }}</span><span>件</span></div>
      <div class="text item"><span class="el-icon-money">库存总额:</span><span class="stat">{{ item.amount }}</span><span>元</span></div>
      <div class="bottom clearfix">
        <el-button type="text" class="button">盘点统计</el-button>
        <el-button type="text" class="button" @click="toInStorePage(item)">入库记录</el-button>
        <el-button type="text" class="button">出库记录</el-button>
        <el-button type="text" class="button" @click="toTransferPage(item)">调拨记录</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import { stockStat } from "@/api/stockCheck";

export default {
  name: "StockCheck",
  data() {
    return {
      isLoading: false,
      statData: [],
    }
  },
  computed: {
    divHeight() {
      return this.$baseTableHeight(0)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.isLoading = true
      const { data } = await stockStat()
      this.isLoading = false
      this.statData = data
    },

    toInStorePage(item) {
      this.$router.push({
        path: '/goodsIn',
        query: {
          storeId: item.storeId,
        }
      })
    },

    toTransferPage(item) {
      this.$router.push({
        path: '/transfer',
        query: {
          storeId: item.storeId,
        }
      })
    },
  }
}
</script>

<style scoped>
.text {
  font-weight: bold;
  font-size: 14px;
  color: #787373;
}
.text span {
  margin: 2px;
}

.item {
  margin-bottom: 18px;
}

.stat {
  color: #0976ea;
  font-size: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}

.box-card {
  width: 30%;
  margin: 10px;
  height: 360px;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
