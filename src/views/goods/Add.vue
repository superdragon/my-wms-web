<template>
  <el-dialog title="添加商品" :visible.sync="dialogVisible">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini" style="width: 600px;">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="编码" prop="code">
            <el-input v-model.trim="form.code" placeholder="请输入编码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model.trim="form.name" placeholder="请输入名称" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="售价(元)" prop="price">
            <el-input v-model.number="form.price" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进货价(元)" prop="innerPrice">
            <el-input v-model.number="form.innerPrice" placeholder="请输入价格" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="上下架">
        <el-radio-group v-model="form.status">
          <el-radio :label="0">上架</el-radio>
          <el-radio :label="1">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="品牌" label-width="60px">
            <el-select v-model.number="form.brandId" placeholder="请选择品牌">
              <el-option v-for="item in brands" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="包装" label-width="60px">
            <el-select v-model.number="form.packId" placeholder="请选择包装">
              <el-option v-for="item in packs" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="口味" label-width="60px">
            <el-select v-model.number="form.tasteId" placeholder="请选择口味">
              <el-option v-for="item in tastes" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="商品图片">
        <el-upload
            :action="uploadUrl"
            list-type="picture-card"
            :file-list="fileList"
            :limit="3"
            :on-success="handleUploadSuccess"
            :on-remove="handleRemoveSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width: 400px;" @click="handleSub">提     交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { findGoodsBrand } from "@/api/goodsBrand";
import { findGoodsPack } from "@/api/goodsPack";
import { findGoodsTaste } from "@/api/goodsTaste";
import { saveGoods } from "@/api/goods";

export default {
  name: "GoodsAdd",
  data() {
    return {
      dialogVisible: false,
      fileList: [],
      uploadImages: [],
      brands: [],
      packs: [],
      tastes: [],
      form: {
        code: '',
        name: '',
        price: '',
        innerPrice: '',
        status: 0,
        brandId: '',
        packId: '',
        tasteId: '',
      },
      rules: {
        code: [
          { required: true, message: '请输入商品编码', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        price: [
          { required: true, message: '请输入商品销售价', trigger: 'blur' },
        ],
        innerPrice: [
          { required: true, message: '请输入商品进货价', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    uploadUrl() {
      const baseUrl = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_BASE_URL : ''
      return baseUrl + 'file/uploadImage'
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    show(flag) {
      this.dialogVisible = flag
    },

    async fetchData() {
      let brandResult = await findGoodsBrand({
        status: 0,
      })
      this.brands = brandResult.data
      let packResult = await findGoodsPack()
      this.packs = packResult.data
      let tasteResult = await findGoodsTaste()
      this.tastes = tasteResult.data
    },

    // 点击提交按钮的处理方法
    handleSub() {
      // this.$refs["form"] 找到对应的表单对象, 值是ref属性的值
      this.$refs["form"].validate((valid) => {
        if (valid) { // 规则验证通过
          if (this.uploadImages.length <= 0) {
            this.$message.error('请添加商品图片')
            return false
          }
          // 请求后端API更新账户资料
          let reqData = {...this.form}
          reqData.imageUrls = [...this.uploadImages]
          this.loading = true
          saveGoods(reqData).then(() => {
            // 处理成功
            this.$message.success('创建成功')
            this.dialogVisible = false
            // 刷新列表
            this.$emit("fetch-data")
          }).catch(() => {
            // 处理失败
          })
        } else { // 规则验证失败
          return false;
        }
      });
    },

    handleUploadSuccess(response, file, fileList) {
      let urls = []
      fileList.forEach(item => {
        urls.push(item.response.data)
      })
      this.uploadImages = urls
    },

    handleRemoveSuccess(file, fileList) {
      let urls = []
      fileList.forEach(item => {
        urls.push(item.response.data)
      })
      this.uploadImages = urls
    },
  }
}
</script>

<style scoped>

</style>
