<template>
  <div v-loading="isLoading">
    <el-row :gutter="20">
      <el-col :span="2">
        <el-button type="primary" icon="el-icon-plus" v-if="checkPermission('goods_in_add')" size="small" @click="handleAdd">添加</el-button>
      </el-col>

      <el-col :span="22">
        <el-select v-model.number="filterFrom.storeId" clearable placeholder="请选择仓库" size="small" style="margin-right: 10px;">
          <el-option v-for="item in storeList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-input placeholder="入库单号" v-model="filterFrom.id" clearable size="small"
                  style="width: 300px;margin-right: 10px;"></el-input>
        <el-date-picker v-model="filterFrom.dateRange" type="datetimerange" range-separator="至"
                        placement="bottom-start"
                        size="small" start-placeholder="开始日期" end-placeholder="结束日期"
                        value-format="yyyy-MM-dd HH:mm:ss" style="margin-right: 10px;">
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
      </el-col>
    </el-row>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="id" label="入库单号" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="storeName" label="入库仓库" width="100"></el-table-column>
      <el-table-column prop="empName" label="制单人" width="120"></el-table-column>
      <el-table-column prop="createTime" label="入库时间" width="180"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" plain icon="el-icon-info" type="primary" @click="handleInfo(scope.row)">详情</el-button>
          <el-button size="mini" v-if="checkPermission('goods_in_edit')" plain icon="el-icon-delete" type="danger" @click="handleDel(scope.row)">删除</el-button>
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

    <InStoreAdd ref="inStoreAdd" @fetch-data="fetchData"></InStoreAdd>
    <InStoreInfo ref="inStoreInfo"></InStoreInfo>
  </div>
</template>

<script>
import { inStorePage, inStoreListRemove } from "@/api/goodsIn";
import InStoreAdd from '@/views/goodsIn/Add'
import InStoreInfo from '@/views/goodsIn/Info'
import {listStore} from "@/api/store";

export default {
  name: "GoodsIn",
  components: {
    InStoreAdd,
    InStoreInfo,
  },
  data() {
    return {
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      storeList: [],
      filterFrom: {
        storeId: '',
        id: '',
        sDate: '',
        eDate: '',
        dateRange: [],
      },
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(60)
    }
  },
  created() {
    this.initStore()
    // 初始化数据
    this.fetchData()
  },
  methods: {
    checkPermission(key) {
      return this.$checkPermission(key)
    },

    async initStore() {
      const { data } = await listStore({status: 0})
      this.storeList = data
    },

    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
      }
      // 如果模糊查询关键字有值
      if (this.filterFrom.id) {
        reqData.id = this.filterFrom.id
      }
      if (this.filterFrom.storeId) {
        reqData.storeId = this.filterFrom.storeId
      }
      if (this.filterFrom.dateRange && this.filterFrom.dateRange.length > 0) {
        reqData.sDate = this.filterFrom.dateRange[0]  // 开始日期
        reqData.eDate = this.filterFrom.dateRange[1]  // 结束日期
      }
      let result = await inStorePage(reqData)
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

    handleAdd() {
      this.$refs['inStoreAdd'].show(true)
    },

    handleQuery() {
      this.fetchData()
    },

    handleInfo(item) {
      this.$refs['inStoreInfo'].show(true, item);
    },

    handleDel(item) {
      let message = '确定要删除【' + item.id + '】的入库信息吗?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await inStoreListRemove({id: item.id})
        this.$message.success('删除成功')
        this.fetchData()
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
