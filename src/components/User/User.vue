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
            <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="Adduser"
              >添加用户</el-button
            ></el-col
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
                @change="userStateChanged(scope.row)"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="min"
                @click="showEditDialog(scope.row.id)"
              ></el-button>
              <!-- 删除 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="min"
                @click="deleteUserById(scope.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="min"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- 表单部分 -->
      <el-form
        :model="addForm"
        :rules="addFromRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="esitDialogVisible"
      width="50%"
      @close="esitDialogClose"
    >
      <!-- 表单部分 -->
      <el-form
        :model="esitForm"
        :rules="esitFormRules"
        ref="esitFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="esitForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="esitForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="esitForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="esitDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="esitUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="userDialogVisible"
      width="50%"
      @close="closeRolesDialog"
    >
      <p>当前用户：{{userInfo.username}}</p>
      <p>当前角色：{{userInfo.address}}</p>
      <p>分配新角色：
        <el-select v-model="selectRoles" placeholder="请选择">
          <el-option
            v-for="item in userRoleList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userDetermine"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //验证邮箱规则
    var checkemail = (rule, value, cb) => {
      //验证预想的正则
      const regEmail = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入正确的邮箱"));
      }
    };
    // 自定义的验证规则
    // 验证手机号码规则
    var checkmobile = (rule, value, cb) => {
      //验证邮箱的正则
      const regEmail = /^1[3456789]\d{9}$/;
      if (regEmail.test(value)) {
        return cb();
      } else {
        cb(new Error("请输入正确的手机号"));
      }
    };
    return {
      //获取用户列表的相关参数
      queryInfo: {
        query: "",
        pagenum: 1, //当前页数
        pagesize: 2, //当前页可显示多少条数据
      },
      userList: [],
      total: 0,
      addDialogVisible: false, //控制添加用户对话框的显示和隐藏
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      }, //添加用户表单数据
      //添加表单的验证规则
      addFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      //控制修改用户对话框的显示与隐藏
      esitDialogVisible: false,
      //获取到的用户信息
      esitForm: {},
      //修改表单的验证规则
      esitFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkemail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkmobile, trigger: "blur" },
        ],
      },
      //分配角色是否显示的条件
      userDialogVisible:false,
      //需要被分配角色的用户信息
      userInfo:'',
      //保存用户角色列表
      userRoleList:[],
      //已选中的角色ID
      selectRoles:''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    //获取用户列表 ，搜索功能
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      } else {
        this.userList = res.data.users;
        this.total = res.data.total;
      }
      console.log(res);
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    //监听switch，修改数据的状态
    async userStateChanged(userinfo) {
      console.log(userinfo);
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新用户状态失败");
      } else {
        this.$message.success("更新用户状态成功");
      }
    },
    //点击添加用户，弹出对话框
    Adduser() {
      this.addDialogVisible = true;
    },
    //添加用户框关闭时重置相关信息
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    //
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
          //可以发起添加用户的网络请求
        }
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.msg !== 201) {
          this.$message.success("用户添加失败");
        } else {
          this.$message.error("用户添加成功");
        }
        this.addDialogVisible = false; //隐藏添加用户的对话框
        this.getUserList(); //重新获取用户列表
      });
    },
    //展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("/users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败");
      }
      this.esitForm = res.data;
      this.esitDialogVisible = true;
    },
    //监听修改用户对话框的关闭事件
    esitDialogClose() {
      this.$refs.esitFormRef.resetFields();
    },
    //提交修改的用户信息
    esitUserInfo() {
      this.$refs.esitFormRef.validate(async (valid) => {
        if (!valid) {
          return;
          //可以发起修改用户的网络请求
        }
        const { data: res } = await this.$http.put(
          "users/ " + this.esitForm.id,
          {
            email: this.esitForm.email,
            mobile: this.esitForm.mobile,
          }
        );
        if (res.meta.msg !== 200) {
          this.$message.error("用户信息修改失败");
        }
        this.esitDialogVisible = false; //隐藏修改用户的对话框
        this.getUserList(); //重新获取用户列表
        this.$message.success("用户信息修改成功");
      });
    },
    //根据ID删除用户
    async deleteUserById(id) {
      //弹框询问是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      //如果用户确认删除，则返回值为字符串confirm
      //如果用户取消删除，侧返回值为字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消");
      }
      //
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getUserList();
    },
    //展示分配角色的对话框
    async setRole(userInfo){
      this.userInfo = userInfo
      //展示对话框之前获取所有的用户角色列表
      const {data : res} = await this.$http.get("roles")
      if(res.meta.status !== 200){
        return this.$message.error("获取角色列表失败")
      }
      this.userRoleList = res.data
      this.userDialogVisible = true
    },
    //点击按钮分配角色
    async userDetermine(){
      if(!this.selectRoles){
        return this.$message.error("请选择要分配的角色")
      }
      const {data : res} =await this.$http.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoles})
      if(res.meta.status !==200){
        return this.$message.error("设置角色失败")
      }
      this.$message.success("设置角色成功")
      this.getUserList()
      this.userDialogVisible = false
    },
    //监听分配角色对话框关闭事件
    closeRolesDialog(){
      this.selectRoles = ""
      this.userInfo = ""
    }
  },
};
</script>
<style lang="scss" scoped></style>
