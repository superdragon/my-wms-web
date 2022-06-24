<template>
  <el-dialog title="设置商品安全库存" :visible.sync="dialogVisible" width="80%">
    <div v-loading="isLoading">
      <el-descriptions title="仓库信息" :column="4">
        <el-descriptions-item label="名称">{{ store.name }}</el-descriptions-item>
        <el-descriptions-item label="联系人">{{ store.conName }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ store.conPhone }}</el-descriptions-item>
        <el-descriptions-item label="通用安全库存">
          <el-tag type="danger" size="mini">{{ store.safeNum }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider></el-divider>

      <el-row :gutter="20">
        <el-col :span="6">
          <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
        </el-col>

        <el-col :span="18">
          <el-input placeholder="商品名称/商品编码" v-model="filterFrom.name" clearable size="small"
                    style="width: 500px;margin-right: 10px;"></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
        </el-col>
      </el-row>

      <el-table
          stripe
          :data="tableData"
          height="260px">
        <el-table-column prop="goodsName" label="商品名称" width="150" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="goodsCode" label="商品编号" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="storeName" label="所属仓库" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="safeNum" label="安全库存" width="100" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" plain icon="el-icon-close" type="danger" @click="handleDel(scope.row)">删除</el-button>
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

      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="40%" append-to-body>

        <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px">
          <el-form-item label="商品" prop="goodsId">
            <el-select v-model.number="form.goodsId" placeholder="请选择商品" :disabled="subBtnName === 1" style="width: 90%;">
              <el-option v-for="item in goodsList" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="安全库存" prop="safeNum">
            <el-input v-model.number="form.safeNum" autocomplete="off" style="width: 90%"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleSub">{{subBtnName === 0 ? '添加': '修改'}}</el-button>
        </div>

      </el-dialog>
    </div>
  </el-dialog>
</template>

<script>
import {addSafeStore, pageSafeStore, updateSafeStore, removeSafeStore} from '@/api/safeStore'
import { listGoods } from "@/api/goods";

export default {
  name: "GoodsSafeNum",
  data() {
    return {
      dialogVisible: false,
      dialogFormVisible: false,
      title: '',
      store: {},
      subBtnName: 0,
      pageSize: 10,
      totalNum: 0,
      pageNum: 1,
      isLoading: false,
      tableData: [],
      goodsList: [],
      filterFrom: {
        name: '',
      },
      form: {
        'goodsId': '',
        'safeNum': '',
      },
      rules: {
        goodsId: [
          {required: true, message: '请选择商品', trigger: 'change'},
        ],
        safeNum: [
          {required: true, message: '请输入安全库存值', trigger: 'blur'},
          {min: 1, type: 'number',  message: '请输入安全库存值', trigger: 'blur'},
        ],
      }
    }
  },
  methods: {
    async show(flag, item) {
      this.dialogVisible = flag
      this.store = {...item}

      const { data } = await listGoods({status: 0})
      this.goodsList = data

      this.fetchData()
    },

    async fetchData() {
      let reqData = {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        storeId: this.store.id,
      }
      // 如果模糊查询关键字有值
      if (this.filterFrom.name) {
        reqData.name = this.filterFrom.name
      }
      // 请求后端API
      this.isLoading = true
      let { data } = await pageSafeStore(reqData)
      this.tableData = data.items
      this.pageNum = data.pageNum
      this.pageSize = data.pageSize
      this.totalNum = data.totalNum
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
      // 重置数据
      this.form = this.$options.data().form
      // 改按钮名称
      this.subBtnName = 0
      this.title = '添加商品安全库存'
      this.dialogFormVisible = true
    },

    handleEdit(item) {
      this.form = {...item}
      this.subBtnName = 1
      this.title = '修改商品安全库存'
      this.dialogFormVisible = true
    },

    handleDel(row) {
      let message = '你确定要删除【' + row.goodsName + '】的安全库存记录吗?'
      let reqData = {
        id: row.id,
      }
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await removeSafeStore(reqData)
        this.fetchData()
      }).catch(() => {});
    },

    handleSub() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          if (this.subBtnName === 0) { // 添加
            console.log(this.form)
            let reqData = {...this.form}
            reqData.storeId = this.store.id
            const { code } = await addSafeStore(reqData)
            if (code === 200) {
              this.dialogFormVisible = false
              this.$message.success('添加成功')
            }
          } else if (this.subBtnName === 1) { // 修改
            let reqData = {...this.form}
            reqData.storeId = this.store.id
            const { code } = await updateSafeStore(reqData)
            if (code === 200) {
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            }
          }
          this.fetchData()
        }
      })
    },
  }
}
</script>

<style scoped>

</style>
