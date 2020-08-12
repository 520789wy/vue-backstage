<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/images/logo.png" />
        <span>商城后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="iscollapse ? '65px' : '200px'">
        <div class="toggle-butto" @click="changetoggle">|||</div>
        <!-- 侧边菜单 -->
        <el-menu
          unique-opened
          background-color="#333744"
          active-text-color="#ffd04b"
          text-color="#fff"
          :collapse="iscollapse"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menuLists"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuLists: [],
      iconsObj: {
        "125": "iconfont iconyonghu",
        "103": "iconfont iconquanxian",
        "101": "iconfont iconshangpin",
        "102": "iconfont icondingdan",
        "145": "iconfont icondata",
      },
      //是否折叠
      iscollapse: false,
      activePath:""//被激活地址
    };
  },
  methods: {
    //退出
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所有的菜单
    async getmMeuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.menuLists = res.data;
        console.log(this.menuLists);
      }
    },
    //展开折叠
    changetoggle() {
      this.iscollapse = !this.iscollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  },
  created() {
    this.getmMeuList();
    this.activePath=window.sessionStorage.getItem('activePath')
  },
};
</script>
<style lang="scss" scoped>
.home-container {
  width: 100%;
  height: 100%;
}
.el-header {
  background: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-header div {
  display: flex;
  align-items: center;
}
.el-header div span {
  margin-left: 20px;
}
.el-aside {
  background: #333744;
}
.el-main {
  background: #eaedf1;
}
.el-menu {
  border: 0;
}
.el-submenu .el-menu {
  background: #333744;
}
.iconfont {
  padding-right: 10px;
}
.toggle-butto {
  color: #fff;
  text-align: center;
  letter-spacing: 0.2rem;
  background: #4a5064;
  font-size: 14px;
  line-height: 24px;
}
</style>
