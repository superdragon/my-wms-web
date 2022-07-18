<template>
  <el-dialog title="创建采购订单" :visible.sync="dialogVisible" width="80%">
    <el-select v-model="form.salerId" size="small" placeholder="请选择销售经理" @change="handleChangeSaler" style="margin-right: 10px;">
      <el-option v-for="item in salerList" :key="item.id + 'saler'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.customerId" size="small" placeholder="请选择客户" @change="handleChangeCustomer" style="margin-right: 10px;">
      <el-option v-for="item in customerList" :key="item.id + 'customer'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.addressId" size="small" placeholder="请选择收货地址" @change="handleChangeAddress" style="margin-right: 10px;width: 300px;">
      <el-option v-for="item in addressList" :key="item.id + 'address'"
                 :value="item.id" :label="item.provName + ' ' + item.cityName + ' ' + item.address"></el-option>
    </el-select>

    <el-select v-model="form.payType" size="small" placeholder="请支付方式" style="margin-right: 10px;">
      <el-option :value="1" label="汇款"></el-option>
      <el-option :value="2" label="支付宝"></el-option>
      <el-option :value="3" label="微信"></el-option>
    </el-select>

    <el-divider></el-divider>

    <el-descriptions title="收货具体信息">
      <el-descriptions-item label="收货人姓名">{{ form.expressName }}</el-descriptions-item>
      <el-descriptions-item label="收货人联系电话">{{ form.expressPhone }}</el-descriptions-item>
      <el-descriptions-item label="收货人详细地址">{{ expressAddressInfo }}</el-descriptions-item>
    </el-descriptions>

    <el-divider content-position="left">采购商品清单</el-divider>

    <el-select v-model="form.goodsId" size="small" placeholder="请选择商品" style="margin-right: 10px;width: 500px;">
      <el-option v-for="item in goodsList" :key="item.id + 'goods'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-input placeholder="商品数量" size="small" v-model="form.goodsNum" style="margin-right: 10px;width: 200px;">
      <template slot="prepend">数量</template>
    </el-input>
    <el-button type="primary" @click="handleAdd" size="small">添加商品</el-button>

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
      <el-button type="primary" @click="handleSub">创建采购清单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {listGoods} from "@/api/goods";
import { listSaler } from '@/api/saler'
import { addTrade } from '@/api/trade'
import { listCustomer, listCustomerAddress } from '@/api/customer'

export default {
  name: "TradeAdd",
  data() {
    return {
      dialogVisible: false,
      salerList: [],
      customerList: [],
      goodsList: [],
      addressList: [],
      expressAddressInfo: '',
      form: {
        salerId: '',
        customerId: '',
        customePhone: '',
        expressAddress: '',
        expressPhone: '',
        expressProvId: '',
        expressCityId: '',
        addressId: '',
        goodsId: '',
        goodsNum: '',
        goodsList: [],
        payType: '',
      }
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(400)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      let salerResult = await listSaler()
      this.salerList = salerResult.data
      // 获取商品
      let goodsListResult = await listGoods({status: 0})
      this.goodsList = goodsListResult.data
    },

    show(flag) {
      this.dialogVisible = flag
    },

    async handleChangeSaler(id) {
      let customerResult = await listCustomer({'salerId': id})
      this.customerList = customerResult.data
    },

    async handleChangeCustomer(id) {
      let addressResult = await listCustomerAddress({'customerId': id})
      this.addressList = addressResult.data
      let customer = this.customerList.find(item => {
        if (item.id === id) {
          return item
        }
      })
      this.form.customePhone = customer.phone
      this.form.expressName = customer.name
      this.form.expressPhone = customer.phone
    },

    handleChangeAddress(id) {
      let address = this.addressList.find(item => {
        if (item.id === id) {
          return item
        }
      })
      this.form.expressAddress = address.address
      this.form.expressProvId = address.provId
      this.form.expressCityId = address.cityId
      this.expressAddressInfo = address.provName + ' ' + address.cityName + ' ' + address.address
    },

    handleAdd() {
      // 判断有效性
      if (!this.form.goodsId) {
        this.$message.error('请选择入库商品')
        return
      }
      if (!this.form.goodsNum) {
        this.$message.error('请输入入库商品的数量')
        return
      }

      let updatedGoods = []
      // 找到是否已经添加同种商品，
      let addGoods = this.form.goodsList.find(item => {
        return item.id === this.form.goodsId
      })
      if (addGoods) {
        // 如果有，把新增数量增加到同种商品上
        addGoods.num = (addGoods.num - 0) + (this.form.goodsNum - 0)
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
          updatedGoods = [...this.form.goodsList]
          updatedGoods.push({...selectGoods})
          this.form.goodsList = updatedGoods
        }
      }
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

    async handleSub() {
      // 判断有效性
      if (!this.form.salerId) {
        this.$message.error('请选择销售经理')
        return
      }
      if (!this.form.customerId) {
        this.$message.error('请选择客户信息')
        return
      }
      if (!this.form.addressId) {
        this.$message.error('请选择收货信息')
        return
      }
      if (!this.form.payType) {
        this.$message.error('请选择支付方式')
        return
      }
      if (!this.form.goodsList.length) {
        this.$message.error('请添加采购商品')
        return
      }

      // 组装商品数据
      let goods = []
      this.form.goodsList.forEach((item) => {
        goods.push({
          goodsId: item.id,
          goodsNum: item.num,
          goodsName: item.name,
        })
      })

      // 组装请求数据
      let reqData = {
        ...this.form,
        goods,
      }

      await addTrade(reqData)
      this.$message.success('采购清单创建成功')
      this.dialogVisible = false
      this.$emit('fetch-data')
    },
  }
}
</script>

<style scoped>

</style>
