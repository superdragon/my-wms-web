<template>
  <div v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-button v-if="checkPermission('store_edit')" type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
      </el-col>

      <el-col :span="18">
        <el-input placeholder="仓库名称/联系人/联系电话" v-model="form.keyWord" clearable size="small"
                  style="width: 500px;margin-right: 10px;"></el-input>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      </el-col>
    </el-row>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="name" label="仓库" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="conName" label="联系人" width="100"></el-table-column>
      <el-table-column prop="conPhone" label="联系电话" width="120"></el-table-column>
      <el-table-column prop="safeNum" label="安全库存" width="100"></el-table-column>
      <el-table-column prop="provName" label="省份" width="100"></el-table-column>
      <el-table-column prop="cityName" label="城市" width="100"></el-table-column>
      <el-table-column prop="address" label="详细地址" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="danger">禁用</el-tag>
          <el-tag v-if="scope.row.status === 0">启用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
      <el-table-column prop="createTime" label="添加时间" width="180"></el-table-column>
      <el-table-column label="操作" fixed="right" width="300">
        <template slot-scope="scope">
          <el-button v-if="checkPermission('store_edit')" size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-if="checkPermission('set_safe_num')" size="mini" plain icon="el-icon-edit" type="primary" @click="handleSafeNum(scope.row)">库存</el-button>
          <el-button v-if="scope.row.status === 1 && checkPermission('store_edit')" size="mini" plain icon="el-icon-check" type="primary"
                     @click="handleEnable(scope.row, 0)">启用
          </el-button>
          <el-button v-if="scope.row.status === 0 && checkPermission('store_edit')" size="mini" plain icon="el-icon-close" type="danger"
                     @click="handleEnable(scope.row, 1)">禁用
          </el-button>
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

    <StoreAdd ref="storeAdd" @fetch-data="fetchData"></StoreAdd>
    <StoreEdit ref="storeEdit" @fetch-data="fetchData"></StoreEdit>
    <GoodsSafeNum ref="goodsSafeNum"></GoodsSafeNum>
  </div>
</template>

<script>
import { pageStore } from "@/api/store";
import StoreAdd from '@/views/store/Add'
import StoreEdit from '@/views/store/Edit'
import GoodsSafeNum from "@/views/store/GoodsSafeNum";

export default {
  name: "StoreMgr",
  components: {
    StoreAdd,
    StoreEdit,
    GoodsSafeNum,
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      goodsBrands: [],
      form: {
        keyWord: '',
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
      if (this.form.keyWord) {
        reqData.name = this.form.keyWord
      }
      let result = await pageStore(reqData)
      this.pageNum = result.data.pageNum
      this.pageSize = result.data.pageSize
      this.totalNum = result.data.totalNum
      this.tableData = result.data.items
      // 关闭遮罩层
      this.isLoading = false
    },

    handleSizeChange(ps) {
      this.pageSize = ps
      this.fetchData()
    },
    handleCurrentChange(pn) {
      this.pageNum = pn
      this.fetchData()
    },

    handleQuery() {
      this.fetchData()
    },

    handleAdd() {
      this.$refs['storeAdd'].show(true)
    },

    handleEnable() {},

    handleEdit(item) {
      this.$refs['storeEdit'].show(true, item)
    },

    handleSafeNum(item) {
      this.$refs['goodsSafeNum'].show(true, item)
    },
  }
}
</script>

<style scoped>

</style>
