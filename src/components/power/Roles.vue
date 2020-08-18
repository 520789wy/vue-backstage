<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripes>
        <el-table-column type="expand">
            <template slot-scope="scope">
                <el-row :class="['bdbottom',index===0 ? 'dbtop': '']" v-for="(item,index) in scope.row.children" :key="index">
                    <!-- 一级权限 -->
                    <el-col :span="5" >
                        <el-tag closable>{{item.authName}}</el-tag>
                        <i class="el-icon-caret-right"></i>
                    </el-col>
                    <!-- 二级权限 -->
                    <el-col :span="19" >
                        <el-row v-for="(itemer,indexer) in item.children" :key="indexer" :class="[indexer==='0' ? '':'dbtop']">
                            <el-col :span="6">
                                <el-tag type="success" closable>{{itemer.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 三级权限 -->
                            <el-col :span="18">
                                <el-tag type="warning" v-for="(items,indexs) in itemer.children" :key="indexs" closable>{{items.authName}}</el-tag>
                            </el-col>
                        </el-row>
                    </el-col>
                </el-row>
            </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#" ></el-table-column>
        
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" >
            <template >
                <el-button size="mini" type="primary" icon="el-icon-edit" >编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
                <el-button size="mini" type="warning" icon="el-icon-setting" >分配权限</el-button>
            </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if(res.meta.status !== 200){
          return this.$message.error("获取失败")
      }
      this.rolesList=res.data
      console.log(this.rolesList)
    },
  },
};
</script>
<style lang="scss">
    .el-tag{
        margin:7px;
    }
    .dbtop{
        border-top:1px solid #dedede;
    }
    .bdbottom {
        border-bottom:1px solid #dedede;
    }
</style>
