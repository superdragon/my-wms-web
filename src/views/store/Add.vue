<template>
  <el-dialog title="添加仓库" :visible.sync="dialogVisible">

    <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="80px">
      <el-form-item label="仓库名称" prop="name">
        <el-input v-model.trim="form.name" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="安全库存" prop="safeNum">
        <el-input v-model.number="form.safeNum" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="conName">
        <el-input v-model.trim="form.conName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="conPhone">
        <el-input v-model.trim="form.conPhone" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input v-model.trim="form.address" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="城市">
        <el-select v-model.number="form.provId" placeholder="请选择省份" style="margin-right: 10px;" @change="handleChangeProv">
          <el-option v-for="item in provList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
        <el-select v-model.number="form.cityId" placeholder="请选择城市">
          <el-option v-for="item in cityList" :key="item.id" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model.number="form.status">
          <el-radio :label="0">启用</el-radio>
          <el-radio :label="1">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">添 加</el-button>
    </div>

  </el-dialog>
</template>

<script>
import {listCity, listProv} from "@/api/city";
import { addStore } from "@/api/store";

export default {
  name: "StoreAdd",
  data() {
    return {
      dialogVisible: false,
      cityList: [],
      provList: [],
      form: {
        'name': '',
        'conName': '',
        'conPhone': '',
        'address': '',
        'safeNum': '',
        'status': 0,
        'provId': '',
        'cityId': '',
      },
      rules: {
        name: [
          {required: true, message: '请输入仓库名称', trigger: 'blur'},
        ],
        conName: [
          {required: true, message: '请输入联系人名称', trigger: 'blur'},
        ],
        conPhone: [
          {required: true, message: '请输入联系电话', trigger: 'blur'},
        ],
        address: [
          {required: true, message: '请输入详细地址', trigger: 'blur'},
        ],
        safeNum: [
          {required: true, message: '请输入安全库存值', trigger: 'blur'},
          {min: 1, type: 'number',  message: '请输入安全库存值', trigger: 'blur'},
        ],
      }
    }
  },
  created() {
    this.initProv()
  },
  methods: {
    show(flag) {
      this.dialogVisible = flag
    },

    async initProv() {
      const { data } = await listProv()
      this.provList = data
    },

    // 省份发生变化
    async handleChangeProv(item) {
      if (item > 0) {
        const { data } = await listCity({provId: item})
        this.cityList = data
      }
    },

    handleSub() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          let reqData = {...this.form}
          await addStore(reqData)
          this.$message.success('创建成功')
          this.dialogVisible = false
          // 刷新列表
          this.$emit("fetch-data")
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
