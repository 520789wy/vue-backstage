<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="box-card">
      <div>
        <!-- 搜索框，添加 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容" class="input-with-select">
              <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary">添加用户</el-button></el-col
          >
        </el-row>
        <!-- 用户列表 -->
        <el-table :data="userList" style="width: 100%" border stripe>
          <el-table-column type="index"> </el-table-column>
          <el-table-column prop="username" label="姓名" width="180">
          </el-table-column>
          <el-table-column prop="email" label="邮箱" width="180">
          </el-table-column>
          <el-table-column prop="mobile" label="电话"> </el-table-column>
          <el-table-column prop="address" label="角色"> </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <template slot-scope="scope">
                <!-- {{scope.row}}作用域插槽 -->
                 <!-- scope.row 直接取到该单元格对象，就是数组里的元素对象，即是tableData[scope.$index] -->
                 <!-- .mg_state 是对象里面的mg_state属性的值 -->
              <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
              <template >
                  <!-- 修改 -->
                <el-button type="primary" icon="el-icon-edit" size="min"></el-button>
                <!-- 删除 -->
                <el-button type="danger" icon="el-icon-delete" size="min"></el-button>
                <el-tooltip class="item" effect="dark" content="分配角色" placement="top" manual="true">
                    <el-button type="warning" icon="el-icon-setting" size="min"></el-button>
                  </el-tooltip>
                
              </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //获取用户列表的相关参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      userList: [],
      total: 0,
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.erro(res.meta.msg);
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
      console.log(res);
    },
  },
};
</script>
<style lang="scss" scoped></style>
