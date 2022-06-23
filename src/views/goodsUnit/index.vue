<template>
  <div v-loading="isLoading">
    <el-tabs type="card" v-model="tabPane" @tab-click="handleTabClick">
      <el-tab-pane label="商品品牌" name="goodsBrand">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>

        <el-table
            stripe
            :data="brandData"
            :height="tableHeight">
          <el-table-column prop="name" label="品牌名称" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status === 1" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === 1" size="mini" plain icon="el-icon-circle-check" type="warning" @click="handleEnable(scope.row, 0)">启动</el-button>
              <el-button v-if="scope.row.status === 0" size="mini" plain icon="el-icon-circle-close" type="danger" @click="handleEnable(scope.row, 1)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="商品包装" name="goodsPack">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>

        <el-table
            stripe
            :data="packData"
            :height="tableHeight">
          <el-table-column prop="name" label="包装名称" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status === 1" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === 1" size="mini" plain icon="el-icon-circle-check" type="warning" @click="handleEnable(scope.row, 0)">启动</el-button>
              <el-button v-if="scope.row.status === 0" size="mini" plain icon="el-icon-circle-close" type="danger" @click="handleEnable(scope.row, 1)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="商品口味" name="goodsTaste">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd">添加</el-button>
          </el-col>
        </el-row>

        <el-table
            stripe
            :data="tasteData"
            :height="tableHeight">
          <el-table-column prop="name" label="口味名称" width="100"></el-table-column>
          <el-table-column prop="status" label="状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" type="success">启用</el-tag>
              <el-tag v-if="scope.row.status === 1" type="danger">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" width="180"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" plain icon="el-icon-edit" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.status === 1" size="mini" plain icon="el-icon-circle-check" type="warning" @click="handleEnable(scope.row, 0)">启动</el-button>
              <el-button v-if="scope.row.status === 0" size="mini" plain icon="el-icon-circle-close" type="danger" @click="handleEnable(scope.row, 1)">禁用</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <!-- 添加 -->
    <GoodsUnitAdd ref="goodsUnitAdd" @fetch-data = "fetchData"></GoodsUnitAdd>

    <GoodsUnitEdit ref="goodsUnitEdit" @fetch-data="fetchData"></GoodsUnitEdit>
  </div>
</template>

<script>
import {findGoodsBrand, updateGoodsBrand} from "@/api/goodsBrand";
import {findGoodsTaste, updateGoodsTaste} from "@/api/goodsTaste";
import {findGoodsPack, updateGoodsPack} from "@/api/goodsPack";
import GoodsUnitAdd from "@/views/goodsUnit/Add"
import GoodsUnitEdit from '@/views/goodsUnit/Edit'

export default {
  name: "GoodsUnitMgr",
  components: {
    GoodsUnitAdd,
    GoodsUnitEdit,
  },
  data() {
    return {
      tabPane: 'goodsBrand',
      flag: 1, // 当前展现tab面板的标识
      isLoading: false,
      brandData: [],
      packData: [],
      tasteData: [],
    }
  },
  computed: {
    tableHeight() {
      return this.$baseTableHeight(60)
    }
  },
  created() {
    // 初始化数据
    this.fetchData()
  },
  methods: {
    // 点中 tab 标签时会调用
    handleTabClick(tab) {
      switch (tab.name) {
        case 'goodsBrand':
          this.flag = 1
          break
        case 'goodsPack':
          this.flag = 2
          break
        case 'goodsTaste':
          this.flag = 3
          break
      }
      this.fetchData()
    },

    async fetchData() {
      // 打开遮罩层
      this.isLoading = true
      let result = {}
      switch (this.flag) {
        case 1:
          result = await findGoodsBrand()
          this.brandData = result.data
          break
        case 2:
          result = await findGoodsPack()
          this.packData = result.data
          break
        case 3:
          result = await findGoodsTaste()
          this.tasteData = result.data
          break
      }
      // 关闭遮罩层
      this.isLoading = false
    },

    handleAdd() {
      switch (this.flag) {
        case 1:
          this.$refs['goodsUnitAdd'].show(true, 1, '品牌')
          break
        case 2:
          this.$refs['goodsUnitAdd'].show(true, 2, '包装')
          break
        case 3:
          this.$refs['goodsUnitAdd'].show(true, 3, '口味')
          break
      }
    },

    handleEdit(item) {
      switch (this.flag) {
        case 1:
          this.$refs['goodsUnitEdit'].show(true, 1, '品牌', item)
          break
        case 2:
          this.$refs['goodsUnitEdit'].show(true, 2, '包装', item)
          break
        case 3:
          this.$refs['goodsUnitEdit'].show(true, 3, '口味', item)
          break
      }
    },

    handleEnable(row, action) {
      let content = ''
      if (action === 0 ) {
        content = '是否要启用【' + row.name + '】?'
      } else if (action === 1) {
        content = '是否要禁用【' + row.name + '】?'
      }
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 请求后端API更新账户资料
        let reqData = {
          id: row.id,
          name: row.name,
          status: action
        }

        switch (this.flag) {
          case 1:
            await updateGoodsBrand(reqData)
            break
          case 2:
            await updateGoodsPack(reqData)
            break
          case 3:
            await updateGoodsTaste(reqData)
            break
        }

        setTimeout(() => {
          this.fetchData()
        }, 300)
      }).catch(() => {});
    },
  }
}
</script>

<style scoped>

</style>
