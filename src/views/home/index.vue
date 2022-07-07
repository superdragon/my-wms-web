<template>
  <div v-loading="isLoading" class="card-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日入库单量</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">入库记录</el-button>
      </div>
      <div class="text item"><span class="stat">{{ inStoreTotal }}</span></div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span style="font-weight: bold;">今日调拨单量</span>
        <el-button type="text" class="button" style="float: right; padding: 3px 0;">调拨记录</el-button>
      </div>
      <div class="text item"><span class="stat" style="color: #e6a23c;">{{ transferTotal }}</span></div>
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

    <el-card class="big-card">
      <div id="historyOrder" style="width: 100%;height: 350px;"></div>
    </el-card>
    <el-card class="big-card">
      <div id="historyStore" style="width: 100%;height: 350px;"></div>
    </el-card>
    <el-card class="big-card">
      <div id="historyGoods" style="width: 100%;height: 350px;"></div>
    </el-card>
    <el-card class="big-card">
      <div id="historyBrand" style="width: 100%;height: 350px;"></div>
    </el-card>
  </div>
</template>

<script>
import { todayStatTotal } from '@/api/todayStat'
export default {
  name: "index",
  data() {
    return {
      isLoading: false,
      transferTotal: 0,
      inStoreTotal: 0,
    }
  },
  created() {
    this.fetchData()
  },
  mounted() {
    this.historyOrder()
    this.historyStore()
    this.historyGoods()
    this.historyBrand()
  },
  methods: {
    fetchData() {
      this.runStat()
      this.refreshToday()
    },

    async runStat() {
      const { data } = await todayStatTotal()
      this.transferTotal = data.transferTotal
      this.inStoreTotal = data.inStoreTotal
    },

    refreshToday() {
      setInterval(() => {
        this.runStat()
      }, 10000)
    },

    historyOrder() {
      let dates = []
      let saleAmount = []
      let saleTotal = []
      for(let i = 1; i <= 30; i++) {
        if (i < 10) {
          dates.push('2022060' + i)
        } else {
          dates.push('202206' + i)
        }
        saleAmount.push(Math.floor(Math.random()*5000 + 1000))
        saleTotal.push(Math.floor(Math.random()*100 + 1000))
      }
      let myEcharts = this.$echarts.init(document.getElementById('historyOrder'))
      let option = {
        title: {
          text: '近30日交易'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {},
        xAxis: {
          type: 'category',
          data: dates,
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '销售量',
            axisLabel: {
              formatter: '{value} 件'
            }
          }
        ],
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: saleAmount,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 元';
              }
            },
          },
          {
            name: '销售量',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' 件';
              }
            },
            data: saleTotal
          }
        ]
      }
      myEcharts.setOption(option)
    },

    historyStore() {
      let myEcharts = this.$echarts.init(document.getElementById('historyStore'))
      let option = {
        title: {
          text: '1000000',
          subtext: '近30交易总额',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [
          {
            name: '销售额',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '郑州仓' },
              { value: 735, name: '邯郸仓' },
              { value: 580, name: '石家庄仓' },
              { value: 484, name: '北京仓' },
              { value: 300, name: '沧州仓' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
      }

      myEcharts.setOption(option)
    },

    historyGoods() {
      let myEcharts = this.$echarts.init(document.getElementById('historyGoods'))
      let option = {
        title: {
          text: '近30日商品销量排行榜'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          type: 'category',
          data: ['Brazil', 'Indonesia', 'USA', 'India', 'China', 'World']
        },
        series: [
          {
            name: '2011',
            type: 'bar',
            data: [18203, 23489, 29034, 104970, 131744, 630230]
          },
        ]
      }

      myEcharts.setOption(option)
    },

    historyBrand() {
      let myEcharts = this.$echarts.init(document.getElementById('historyBrand'))
      let option = {
        title: {
          text: '1000000',
          subtext: '近30交易总额',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        legend: {
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
        },
        series: [
          {
            name: '销售额',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: '郑州仓' },
              { value: 735, name: '邯郸仓' },
              { value: 580, name: '石家庄仓' },
              { value: 484, name: '北京仓' },
              { value: 300, name: '沧州仓' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
      }

      myEcharts.setOption(option)
    },
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

.big-card {
  width: 48%;
  margin: 10px;
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
