<template>
  <div v-loading="isLoading" :style="{height: divHeight + 'px',overflow: 'auto'}" class="card-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日入库单量</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">入库记录</el-button>
      </div>
      <div class="text item"><span class="stat">10000</span></div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日调拨单量</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">调拨记录</el-button>
      </div>
      <div class="text item"><span class="stat" style="color: #e6a23c;">10000</span></div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日交易额</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">订单记录</el-button>
      </div>
      <div class="text item"><span class="stat" style="color: #67c23a;">10000</span></div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日交易量</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">订单记录</el-button>
      </div>
      <div class="text item"><span class="stat" style="color: #e46633;">10000</span></div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日下单用户</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">订单记录</el-button>
      </div>
      <div class="text item"><span class="stat" style="color: #e91e49;">10000</span></div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    divHeight() {
      return this.$baseTableHeight(0)
    }
  },
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
  font-size: 48px;
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
  width: 18%;
  margin: 10px;
  height: 150px;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
}
</style>
