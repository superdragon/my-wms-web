<template>
  <el-container>
    <el-header style="background-color: #4e4c4c">
      <el-row>
        <el-col :span="4">
          <img :src="baseURL + 'coca_logo.png'" width="180px" />
        </el-col>
        <el-col :span="16">
          <h1 class="title-container">{{ title }}</h1>
        </el-col>
        <el-col :span="4">
          <el-dropdown trigger="click" style="float: right;">
            <span class="el-dropdown-link">
              <el-avatar :size="50" :src="avatarUrl" style="margin-top: 5px;"></el-avatar>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item icon="el-icon-plus">
                <el-link :underline="false" @click="toMyCenter">个人</el-link>
              </el-dropdown-item>
              <el-dropdown-item icon="el-icon-circle-plus" >
                <el-link :underline="false" @click="logout">退出</el-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="202px">
        <el-menu
            ref="myNav"
            background-color="#4e4c4c"
            :unique-opened="true"
            text-color="#fff"
            active-text-color="#efdb07"
            :style="'height:'+ menuHeight"
            :defaultActive="defaultActive"
            :router="true">
          <el-menu-item index="/home"><i class="el-icon-s-home"></i>首页</el-menu-item>

          <!-- 动态渲染导航菜单 -->
          <el-submenu v-for="item in menus" :key="item.id" :index="'sub' + item.id">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item v-for="citem in item.children" :key="citem.id" :index="citem.path">{{citem.title}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getAccount } from "@/api/account";

export default {
  name: "Layout",
  data() {
    return {
      baseURL: process.env.BASE_URL,
      title: process.env.VUE_APP_TITLE,
      defaultActive: this.$route.path,
      avatarUrl: '',
      menus: this.$store.state.account.menus,
    }
  },
  created() {
    this.fetchData()
  },
  computed: {
    menuHeight() {
      return this.$contentHeight() + 'px'
    },
  },
  methods: {
    async fetchData() {
      let id = this.$store.state.account.accountId
      if (id) {
        let reqData = {id: id}
        let { data } = await getAccount(reqData)
        this.avatarUrl = data.avatarUrl
      }
    },
    async logout() {
      await this.$store.dispatch('account/logoutAction')
      this.$router.push({
        path: '/login',
        replace: true,
      })
    },
    toMyCenter() {
      this.$router.push({
        path: '/myCenter'
      })
    },
  }
}
</script>

<style scoped>
.title-container {
  padding-top: 10px;
  font-size: 30px;
  color: white;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>
