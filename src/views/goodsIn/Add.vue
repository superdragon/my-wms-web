<template>
  <el-dialog title="创建入库清单" :visible.sync="dialogVisible" width="80%">
    <el-select v-model="form.storeId" @change="handleChange" placeholder="请选择仓库" style="margin-right: 10px;">
      <el-option v-for="item in storeList" :key="item.id + 'store'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.empId" placeholder="请选择制表人" style="margin-right: 10px;">
      <el-option v-for="item in empList" :key="item.id + 'emp'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-select v-model="form.goodsId" placeholder="请选择商品" style="margin-right: 10px">
      <el-option v-for="item in goodsList" :key="item.id + 'goods'" :value="item.id" :label="item.name"></el-option>
    </el-select>
    <el-input placeholder="商品数量" v-model="form.goodsNum" style="margin-right: 10px;width: 200px;">
      <template slot="prepend">数量</template>
    </el-input>
    <el-button type="primary" @click="handleAdd">添加商品</el-button>

    <el-divider content-position="left">添加商品清单</el-divider>

    <el-table
        stripe
        :data="form.goodsList"
        :height="tableHeight">
      <el-table-column prop="name" label="商品" width="300" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="code" label="编码" width="100"></el-table-column>
      <el-table-column prop="price" label="价格" width="100"></el-table-column>
      <el-table-column prop="num" label="数量"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain icon="el-icon-delete" type="danger" @click="handleDel(scope.row)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">创建入库清单</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { listStore } from "@/api/store";
import { listGoods } from "@/api/goods";
import { listEmp } from "@/api/employee";
import { inStoreAdd } from "@/api/goodsIn";

export default {
  name: "GoodsInAdd",
  data() {
    return {
      dialogVisible: false,
      form: {
        storeId: '', // 仓库
        empId: '', // 制表人
        goodsId: '', // 商品
        goodsNum: '', // 商品数量
        goodsList: [], // 入库商品清单
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
      this.form.name = ''
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
      // 找到是否已经添加同种商品，
      let isOk = this.form.goodsList.some(item => {
        return item.id === this.form.goodsId
      })
      if (isOk) {
        // 如果有，把新增数量增加到同种商品上
        let selectGoods = this.form.goodsList.map(item => {
          if (item.id === this.form.goodsId) {
            item.num = (item.num - 0) + (this.form.goodsNum - 0)
          }
          return item
        })
        this.form.goodsList = [...selectGoods]
      } else {
        // 获取选择的商品详细信息
        let selectGoods = this.goodsList.find(item => {
          if (item.id === this.form.goodsId) {
            return item
          }
        })
        // 把商品放入清单数组中
        if (selectGoods) {
          // 增加数量属性
          selectGoods.num = this.form.goodsNum
          this.form.goodsList.push({...selectGoods})
        }
      }
    },
    async handleSub() {
      // 判断有效性
      if (!this.form.storeId) {
        this.$message.error('请选择仓库')
        return
      }
      if (!this.form.empId) {
        this.$message.error('请选择制表人')
        return
      }
      if (!this.form.goodsList.length) {
        this.$message.error('请添加入库商品')
        return
      }

      // 组装商品数据
      let goods = []
      this.form.goodsList.forEach(item => {
        goods.push({
          goodsId: item.id,
          goodsNum: item.num
        })
      })

      // 组装请求数据
      let reqData = {
        storeId: this.form.storeId,
        employeeId: this.form.empId,
        goods,
      }
      await inStoreAdd(reqData)

      this.$message.success('入库清单创建成功')
      this.dialogVisible = false
      this.$emit('fetch-data')
    },
  }
}
</script>

<style scoped>

</style>
