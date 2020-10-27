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
          <el-button type="primary" @click="addRolesDialog">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="rolesList" border stripes>
        <!-- 角色名称 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', index === 0 ? 'dbtop' : '']"
              v-for="(item, index) in scope.row.children"
              :key="index"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="(itemer, indexer) in item.children"
                  :key="indexer"
                  :class="[indexer === 0 ? '' : 'dbtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, itemer.id)"
                      >{{ itemer.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(items, indexs) in itemer.children"
                      :key="indexs"
                      closable
                      @close="removeRightById(scope.row, items.id)"
                    >
                      {{ items.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showRightsDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDialog" width="50%">
      <el-form :model="addRole">
        <el-form-item label="角色名称">
          <el-input v-model="addRole.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addRole.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog
      title="分配权限"
      :visible.sync="rightsDialogVisible"
      width="30%"
      @close="setRightsDialogClosed()"
    >
      <el-tree
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defkeys"
        :data="rightsList"
        :props="treeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="alloRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoleDialog: false,
      addRole: {
        roleName: "",
        roleDesc: "",
      },
      //分配权限的对话框是否显示
      rightsDialogVisible: false,
      //获取到的权限数据
      rightsList: [],
      //属性控件的绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      //默认被选中的id
      defkeys: [],
      //当前即将分配权限的角色ID
      roleID:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    //添加角色
    async addRolesDialog() {
      this.addRoleDialog = true;
    },
    async addRoles() {
      this.addRoleDialog = true;
      const { data: res } = await this.$http.post("roles", this.addRole);
      if (res.meta.status !== 201) {
        return this.$message.error("创建失败");
      } else {
        this.$message.success("创建成功");
      }
      this.addRoleDialog = false;
      this.getRolesList();
    },
    //删除角色
    async deleteRoles(id) {
      const comfirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (comfirmResult !== "confirm") {
        return this.$message.info("已取消");
      }
      const { data: res } = await this.$http.delete("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除角色失败");
      }
      this.$message.success("删除角色成功");
      this.getRolesList();
    },
    //根据ID删除权限
    async removeRightById(role, rightId) {
      //弹框提示是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消");
      }
      const { data: res } = await this.$http.delete(
        `roles/+${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      //this.getRolesList();
      role.children = res.data;
    },
    //展示分配权限的对话框
    async showRightsDialog(role) {
      this.roleID=role.id
      //获取所有权限的数据
      const { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败");
      }
      this.rightsList = res.data;
      console.log(this.rightsList);
      //递归获取三级节点
      this.getLeafKeys(role, this.defkeys);
      this.rightsDialogVisible = true;
    },
    //通过递归的形式，获取角色下所有三级权限的id，并保存到defkeys数组中
    getLeafKeys(node, arr) {
      if (!node.children) {
        //如果当前node节点不包含children属性，则是三级节点
        return arr.push(node.id);
      }
      node.children.forEach((item) => this.getLeafKeys(item, arr));
    },
    //监听分配权限对话框的关闭事件
    setRightsDialogClosed() {
      this.defkeys = [];
    },
    //点击为角色分配权限
    async alloRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      const idStr=keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleID}/rights`,{rids:idStr})
      if(res.meta.status !== 200){
        return this.$message.error("添加角色权限失败")
      }else{
        this.$message.success("添加角色权限成功")
        this.rightsDialogVisible = false
        this.getRolesList();
      }
      
    },
  }
};
</script>
<style lang="scss">
.el-tag {
  margin: 7px;
}
.dbtop {
  border-top: 1px solid #dedede;
}
.bdbottom {
  border-bottom: 1px solid #dedede;
}
</style>
