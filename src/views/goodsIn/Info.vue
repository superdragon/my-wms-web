<template>
  <el-dialog title="入库清单详情" :visible.sync="dialogVisible" width="80%">
    <el-descriptions title="入库信息">
      <el-descriptions-item label="单号">{{ infoData.id }}</el-descriptions-item>
      <el-descriptions-item label="仓库">{{ infoData.storeName }}</el-descriptions-item>
      <el-descriptions-item label="制表人">{{ infoData.empName }}</el-descriptions-item>
    </el-descriptions>

    <el-table
        stripe
        :data="tableData"
        :height="tableHeight">
      <el-table-column prop="name" label="商品名称" width="180" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="code" label="商品编号" width="100"></el-table-column>
      <el-table-column prop="price" label="商品单价" width="120"></el-table-column>
      <el-table-column prop="goodsNum" label="入库数量" width="100"></el-table-column>
      <el-table-column prop="brandName" label="品牌" width="100"></el-table-column>
      <el-table-column prop="packName" label="包装" width="100"></el-table-column>
      <el-table-column prop="tasteName" label="口味" width="100"></el-table-column>
      <el-table-column prop="createTime" label="入库时间" width="180"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button v-if="checkPermission('goods_in_edit')" size="mini" plain icon="el-icon-delete" type="danger" @click="handleDel(scope.row)">删除</el-button>
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
  </el-dialog>
</template>

<script>
import { inStoreItemPage, inStoreItemRemove } from "@/api/goodsIn";

export default {
  name: "InStoreListInfo",
  data() {
    return {
      dialogVisible: false,
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      infoData: {},
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(300)
    }
  },
  methods: {
    checkPermission(key) {
      return this.$checkPermission(key)
    },

    show(flag, item) {
      this.infoData = {...item}
      this.dialogVisible = flag
      this.fetchData()
    },

    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      // 调用后端API获取数据
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        listId: this.infoData.id,
      }
      // 请求后端API
      this.isLoading = true
      let { data } = await inStoreItemPage(reqData)
      this.tableData = data.items
      this.pageNum = data.pageNum
      this.pageSize = data.pageSize
      this.totalNum = data.totalNum
      this.isLoading = false
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

    handleDel(item) {
      let message = '确定要删除【' + item.name + '】的入库信息吗?'
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        let reqData = {
          storeId: this.infoData.storeId,
          itemId: item.inStoreItemId,
        }
        await inStoreItemRemove(reqData)
        this.$message.success('删除成功')
        this.fetchData()
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
