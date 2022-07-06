<template>
  <el-dialog title="创建调拨清单" :visible.sync="dialogVisible" width="80%">
    <el-select v-model="form.shipStoreId" size="small" placeholder="请选择发货仓库" @change="handleChange" style="margin-right: 10px;">
      <el-option v-for="item in storeList" :key="item.id + 'shipstore'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.shipEmpId" size="small" placeholder="请选择发货制表人" style="margin-right: 10px;">
      <el-option v-for="item in empList" :key="item.id + 'emp'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.receiveStoreId" size="small" placeholder="请选择收货仓库" style="margin-right: 10px;">
      <el-option v-for="item in storeList" :key="item.id + 'receivestore'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.goodsId" size="small" placeholder="请选择商品" style="margin-right: 10px">
      <el-option v-for="item in goodsList" :key="item.id + 'goods'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-input placeholder="商品数量" size="small" v-model="form.goodsNum" style="margin-right: 10px;width: 200px;">
      <template slot="prepend">数量</template>
    </el-input>
    <el-button type="primary" @click="handleAdd" size="small">添加商品</el-button>

    <el-divider content-position="left">添加调拨商品清单</el-divider>

    <el-table
        stripe
        :data="form.goodsList"
        :height="tableHeight">
      <el-table-column prop="name" label="商品" width="300" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="code" label="编码" width="100"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="num" label="数量" width="100"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain icon="el-icon-delete" type="danger" @click="handleDel(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">创建调拨清单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {listStore} from "@/api/store";
import {listGoods} from "@/api/goods";
import {listEmp} from "@/api/employee";
import {addTransferList} from "@/api/transfer"
import { getGoodsNumByStoreId } from "@/api/stockCheck";

export default {
  name: "StockTransferAdd",
  data() {
    return {
      dialogVisible: false,
      form: {
        shipStoreId: '',
        shipEmpId: '',
        receiveStoreId: '',
        goodsId: '', // 商品
        goodsNum: '', // 商品数量
        goodsList: [], // 商品清单
      },
      storeList: [], // 所有仓库
      empList: [], // 仓库对应员工
      goodsList: [], // 所有商品
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(300)
    }
  },
  created() {
    // 初始化数据
    this.fetchData()
  },
  methods: {
    show(flag) {
      this.dialogVisible = flag
    },

    async fetchData() {
      // 获取所有仓库数据
      let storeListResult = await listStore({status: 0})
      this.storeList = storeListResult.data
      // 获取商品
      let goodsListResult = await listGoods({status: 0})
      this.goodsList = goodsListResult.data
    },

    // 选择仓库时触发的方法
    async handleChange(id) {
      // 获取对应仓库的员工
      let { data } = await listEmp({storeId: id})
      this.empList = data
    },

    handleDel(row) {
      // 剔除要移除的商品
      let selectGoods = this.form.goodsList.filter(item => {
        if (row.id !== item.id) {
          return item
        }
      })
      this.form.goodsList = [...selectGoods]
    },

    async handleAdd() {
      // 判断有效性
      if (!this.form.goodsId) {
        this.$message.error('请选择入库商品')
        return
      }
      if (!this.form.goodsNum) {
        this.$message.error('请输入入库商品的数量')
        return
      }
      // 保存此次添加商品的总数量，判断发货仓库库存是否满足需求
      let myGoods = {
        id: '',
        name: '',
        num: 0
      }
      // 更新后的调拨商品清单
      let updatedGoods = []
      // 找到是否已经添加同种商品，
      let addGoods = this.form.goodsList.find(item => {
        return item.id === this.form.goodsId
      })
      if (addGoods) {
        // 如果有，把新增数量增加到同种商品上
        let num = (addGoods.num - 0) + (this.form.goodsNum - 0)
        myGoods.id = addGoods.id
        myGoods.name = addGoods.name
        myGoods.num = num
      } else {
        // 如果没有 获取选择的商品详细信息
        let selectGoods = this.goodsList.find(item => {
          if (item.id === this.form.goodsId) {
            return item
          }
        })
        // 把商品放入清单数组中
        if (selectGoods) {
          // 增加数量属性
          selectGoods.num = this.form.goodsNum
          myGoods.id = selectGoods.id
          myGoods.name = selectGoods.name
          myGoods.num = selectGoods.num
          updatedGoods = [...this.form.goodsList]
          updatedGoods.push({...selectGoods})
        }
      }

      // 判断发货仓库库存是否满足该商品的调拨数量
      const {data} = await getGoodsNumByStoreId({
        storeId: this.form.shipStoreId,
        goodsIds: myGoods.id,
      })
      if (data.length <= 0) {
        this.$message.error('仓库无【' + myGoods.name + '】商品')
        return
      }
      // 商品余量
      let temp = data[0].inTotal - data[0].outTotal - data[0].outtingTotal
      if (myGoods.num > temp) {
        this.$message.error('仓库【' + myGoods.name + '】商品库存不足,仅剩【' + temp + '】件')
        return
      }

      // 满足则更新调拨商品清单
      if (addGoods) {
        let selectGoods = this.form.goodsList.map(item => {
          if (item.id === myGoods.id) {
            item.num = myGoods.num
          }
          return item
        })
        updatedGoods = [...selectGoods]
      }

      this.form.goodsList = updatedGoods
    },

    async handleSub() {
      // 判断有效性
      if (!this.form.shipStoreId) {
        this.$message.error('请选择发货仓库')
        return
      }
      if (!this.form.receiveStoreId) {
        this.$message.error('请选择收货仓库')
        return
      }
      if (this.form.shipStoreId === this.form.receiveStoreId) {
        this.$message.error('发货仓库和收货仓库不能一样')
        return
      }
      if (!this.form.shipEmpId) {
        this.$message.error('请选择制表人')
        return
      }
      if (!this.form.goodsList.length) {
        this.$message.error('请添加发货商品')
        return
      }

      // 组装商品数据
      let goods = []
      this.form.goodsList.forEach((item) => {
        goods.push({
          goodsId: item.id,
          goodsNum: item.num
        })
      })

      // 组装请求数据
      let reqData = {
        shipStoreId: this.form.shipStoreId,
        shipEmpId: this.form.shipEmpId,
        receiveStoreId: this.form.receiveStoreId,
        goods,
      }

      await addTransferList(reqData)
      this.$message.success('调拨清单创建成功')
      this.dialogVisible = false
      this.$emit('fetch-data')
    },

  }
}
</script>

<style scoped>

</style>
