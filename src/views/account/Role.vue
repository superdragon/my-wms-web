<template>
  <el-dialog title="编辑角色" :visible.sync="dialogVisible">
    <el-transfer :titles="['选择角色', '已选角色']"
                 v-model="checkedRole" :data="roleData"></el-transfer>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSub">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {findAllRoles, getRolesByAccountId, saveAccountRoles} from "@/api/role";

export default {
  name: "AccountRole",
  data() {
    return {
      dialogVisible: false,
      checkedRole: [],
      checkedAccountId: '',
      roleData: [],
      account: {},
    }
  },
  methods: {
    async show(flag, item) {
      this.dialogVisible = flag
      this.account = {...item}

      // 初始化数据
      this.checkedRole = []
      this.roleData = []

      let allRolesResult = await findAllRoles()
      // 组装穿梭框需要的数据结构
      allRolesResult.data.forEach(item => {
        this.roleData.push({
          key: item.id,
          label: item.name
        })
      })

      setTimeout(async () => {
        // 获取当前账户的ID
        const reqData = {
          accountId: item.id
        }
        let myRoles = await getRolesByAccountId(reqData)
        // 组装穿梭框已选角色数据
        myRoles.data.forEach(item => {
          this.checkedRole.push(item.id)
        })
      }, 500)
    },

    async handleSub() {
      if (this.checkedRole.length <= 0) {
        this.$message.error("请选择角色")
        return false
      }
      let reqData = {
        accountId: this.account.id,
        roleIds: this.checkedRole.join(','),
      }
      await saveAccountRoles(reqData)
      this.$message.success("修改成功")
      this.dialogVisible = false
    },
  },
}
</script>

<style scoped>

</style>
