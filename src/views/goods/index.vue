<template>
  <div>
    <el-row>
      <el-col>
        <el-button type="primary" v-if="checkPermission('goods_edit')" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
        <el-button type="primary" v-if="checkPermission('goods_edit')" icon="el-icon-circle-check" size="small" @click="handleEnables(0)">批量上架</el-button>
        <el-button type="danger" v-if="checkPermission('goods_edit')" icon="el-icon-circle-close" size="small" @click="handleEnables(1)">批量下架</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 10px;">
      <el-form :inline="true" :model="filterFrom" size="small">
        <el-form-item label="商品名称/编码">
          <el-input v-model="filterFrom.keyWord" placeholder="请输入商品名称/编码" clearable></el-input>
        </el-form-item>

        <el-form-item label="品牌">
          <el-select v-model="filterFrom.goodsBrandId" clearable placeholder="请选择品牌">
            <el-option v-for="item in goodsBrands" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="价格">
          <el-input placeholder="最低价格" v-model="filterFrom.minPrice" clearable style="width: 140px;margin-right: 10px;"></el-input>
          <el-input placeholder="最高价格" v-model="filterFrom.maxPrice" clearable style="width: 140px;"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <!-- 编号、图片、名称、分类、上/下架、单位、可用库存、系统库存、销售价、成本价、操作(查看、编辑、删除) -->
    <el-table
        stripe
        :data="tableData"
        :height="tableHeight"
        @selection-change="handleSelectionChange">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column prop="code" label="编号" width="80"></el-table-column>
      <el-table-column prop="imageUrl" label="图片" width="80">
        <template slot-scope="scope">
          <el-image
              v-if="scope.row.images.length > 0"
              style="width: 50px; height: 50px"
              :src="scope.row.images[0].imageUrl"
              :preview-src-list="handlePreView(scope.row.images)">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="packName" label="包装" width="100"></el-table-column>
      <el-table-column prop="tasteName" label="口味" width="100"></el-table-column>
      <el-table-column prop="status" label="上/下架" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="danger">下架</el-tag>
          <el-tag v-if="scope.row.status === 0">上架</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="销售价(元)" width="100"></el-table-column>
      <el-table-column prop="innerPrice" label="成本价(元)" width="100"></el-table-column>
      <el-table-column label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <span v-if="checkPermission('goods_edit')">
            <el-button size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" plain icon="el-icon-circle-check" type="primary" @click="handleEnable(scope.row, 0)">上架</el-button>
            <el-button v-if="scope.row.status === 0" size="mini" plain icon="el-icon-circle-close" type="danger" @click="handleEnable(scope.row, 1)">下架</el-button>
          </span>
        </template>
      </el-table-column>
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

    <GoodsAdd ref="goodsAdd" @fetch-data="fetchData"></GoodsAdd>
    <GoodsEdit ref="goodsEdit" @fetch-data="fetchData"></GoodsEdit>
  </div>
</template>

<script>
import { findGoods, updateGoodsStatus } from "@/api/goods";
import { findGoodsBrand } from "@/api/goodsBrand";
import GoodsAdd from '@/views/goods/Add'
import GoodsEdit from '@/views/goods/Edit'

export default {
  name: "GoodsMgr",
  components: {
    GoodsAdd,
    GoodsEdit,
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      goodsBrands: [],
      selecteds: [],
      filterFrom: {
        keyWord: '',
        goodsBrandId: '',
        goodsStatus: -1,
        minPrice: '',
        maxPrice: '',
      }
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(100)
    }
  },
  async created() {
    // 初始化数据
    this.fetchData()
    // 加载品牌数据
    let brankResult = await findGoodsBrand()
    this.goodsBrands = brankResult.data
  },
  methods: {
    checkPermission(key) {
      return this.$checkPermission(key)
    },
    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      if (this.filterFrom.keyWord) {
        reqData.keyWord = this.filterFrom.keyWord
      }
      if (this.filterFrom.goodsStatus === 0 || this.filterFrom.goodsStatus === 1) {
        reqData.status = this.filterFrom.goodsStatus
      }
      if (this.filterFrom.goodsBrandId > 0) {
        reqData.brandId = this.filterFrom.goodsBrandId
      }
      if (this.filterFrom.minPrice) {
        reqData.minPrice = this.filterFrom.minPrice
      }
      if (this.filterFrom.maxPrice) {
        reqData.maxPrice = this.filterFrom.maxPrice
      }
      let result = await findGoods(reqData)
      this.pageNum = result.data.pageNum
      this.pageSize = result.data.pageSize
      this.totalNum = result.data.totalNum
      this.tableData = result.data.items
      // 关闭遮罩层
      this.isLoading = false
    },

    handlePreView(images) {
      let urls = []
      images.forEach(item => {
        urls.push(item.imageUrl)
      })
      return urls;
    },

    handleQuery() {
      this.fetchData()
    },

    handleSelectionChange(rows) {
      this.selecteds = rows
    },

    handleSizeChange(ps) {
      this.pageSize = ps
      this.fetchData()
    },
    handleCurrentChange(pn) {
      this.pageNum = pn
      this.fetchData()
    },

    handleAdd() {
      this.$refs['goodsAdd'].show(true)
    },

    handleEdit(item) {
      this.$refs['goodsEdit'].show(true, item)
    },

    handleEnables(status) {
      let items = [...this.selecteds]
      if (items.length <= 0) {
        this.$message.error('请选择要更新的记录')
        return
      }
      let ids = []
      for (let i = 0; i < items.length; i++) {
        ids.push(items[i].id)
      }

      let message = ''
      if (status === 0) {
        message = '你确定要启用这些商品吗?'
      } else if (status === 1) {
        message = '你确定要禁用这些商品吗?'
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchUpdateStatus(ids, status)
      }).catch(() => {});
    },

    batchUpdateStatus(ids, status) {
      // 请求后端API
      let reqData = {
        ids: ids.join(','),
        status: status
      }
      this.isLoading = true
      updateGoodsStatus(reqData).then(() => {
        this.isLoading = false
        this.fetchData()
      }).catch(() => {
        this.isLoading = false
      })
    },

    handleEnable(row, status) {
      let message = ''
      if (status === 0) {
        message = '你确定要启用商品【' + row.name + '】吗?'
      } else if (status === 1) {
        message = '你确定要禁用商品【' + row.name + '】吗?'
      }

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.batchUpdateStatus([row.id], status)
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
