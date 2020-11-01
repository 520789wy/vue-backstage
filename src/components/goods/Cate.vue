<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      </el-row>
      <el-table
        :data="goodsCategories"
        border
        style="width: 100%"
        align="center"
      >
       
        <!-- 分类名称 -->
        <el-table-column  type="expand">
            <template slot-scope="scope">
              <el-row v-for="(item,index) in scope.row.children" :key="index" class="cat-row">{{item.cat_name}}</el-row>
          </template>
        </el-table-column>

        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <template slot-scope="scope">
            <i class="el-icon-success" v-if="scope.row.cat_deleted == 'true'" style="color:red"> {{scope.row.cat_deleted}}</i>
            <i class="el-icon-success" v-else style="color:green"> </i>
          </template>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag color="#409eff" v-if="scope.row.cat_level=='0'">一级</el-tag>
            <el-tag color="green" v-else-if="scope.row.cat_level=='1'">二级</el-tag>
            <el-tag v-else color="#ef9c11">三级</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" icon="el-icon-edit" @click="showCategoryDialog(scope.row.cat_id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteCategory(scope.row.cat_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1,4, 6, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="添加商品分类"  :visible.sync="dialogVisible" width="50%">
      <el-form ref="addCategoryformRef" :model="addCategory" label-width="80px" >
        <el-form-item label="分类名称">
          <el-input v-model="addCategory.category_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-select v-model="addCategory.cat_name" placeholder="请选择">
            <el-option
              v-for="item in goodsCategories"
              :key="item.cat_id"
              :label="item.cat_name"
              :value="item.cat_name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="CategorySubmit">确定</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑分类 -->
    <el-dialog
      title="修改分类"
      :visible.sync="esitDialogVisible"
      width="30%"
      >
      <el-form :inline="true" :model="addCategory" ref="addCategoryformRef" class="demo-form-inline">
        <el-form-item label="*分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name" placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="esitDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCategory">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      //存放商品分类
      goodsCategories: [],
      defaultProps: {
          children: 'children',
          label: 'label'
        },
      //分页
      total:0,
      queryInfo:{
        type:"",
        pagenum:1,//当前页数
        pagesize:5,//当前页显示数据
      },
      //对话框
      dialogVisible:false,
      esitDialogVisible:false,
      //存放添加分类信息数据
      addCategory:{
        //分类名称
        cat_name:'',
        //分类等级：`0`表示一级分类；`1`表示二级分类；`2`表示三级分类
        cat_level:0,
        //分类父级id
        cat_pid:0
      },
      editCateForm:'',
      //存放父级分类
      parentCateList:[]
      
    };
  },
  created() {
    this.getgoodsCategories();
  },
  methods: {
    
    //获取商品分类
    async getgoodsCategories() {
      const { data: res } = await this.$http.get("categories",{params:this.queryInfo});
      if (res.meta.status !== 200) {
        return this.$message.error("商品分类列表获取失败");
      }
      this.goodsCategories = res.data.result;
      this.total = res.data.total
      // console.log( this.goodsCategories)
    },
    //分页
    //监听pageSize的改变
    handleSizeChange(newsize){
      this.queryInfo.pagesize = newsize;
      this.hetgoodsCategories();
    },
    //监听页码值发生的改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage;
      this.hetgoodsCategories();
    },
    showAddCateDialog(){
      this.getparentCateList()
      this.dialogVisible = true;
      
    },
    //获取父级分类
    async getparentCateList(){
      const {data:res} = await this.$http.get('categories',{params: { type: 1 }})
      if(res.meta.status !== 200){
          this.$message.error("获取父级列表失败")
        }
        this.parentCateList = res.data
        // console.log('111'+this.parentCateList)
    },
    //添加分类信息
    async CategorySubmit(){
      this.$refs.addCategoryformRef.validate(async (valid) =>{
        if(!valid){
          return;
        }
        const {data:res} = await this.$http.post('categories' , this.addCategory)
        if(res.meta.status !== 201){
          this.$message.error("创建失败")
        }else{
          this.$message.success("创建成功")
        }
        this.dialogVisible = false;//隐藏对话框
        this.hetgoodsCategories()//重新获取商品分类列表
      }
      )
    },
    //删除分类
    async deleteCategory(id){
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
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消");
      }
      const {data :res} = await this.$http.delete("categories/" + id)
      if(res.meta.status !==200){
        this.$message.error("商品分类信息删除失败")
      }
      this.$message.success("商品分类信息删除成功");
      this.getgoodsCategories();
    },
    //编辑商品分类
    async showCategoryDialog(id){
      const {data : res} = await this.$http.get('categories/' + id)
        if(res.meta.status !==200){
          this.$message.error("获取商品分类失败")
        }
        this.editCateForm = res.data
        this.esitDialogVisible = true
    },
    editCategory(){
      this.$refs.addCategoryformRef.validate(async (valid) => {
        if(!valid){
          return;
        }
        const {data : res} = await this.$http.put('categories/' + this.editCateForm.cat_id,{
          cat_name:this.editCateForm.cat_name
        })
        if(res.meta.status !==200){
          this.$message.error("商品分类修改失败")
        }
        this.$message.success("商品分类修改成功")
        this.getgoodsCategories()
        this.esitDialogVisible = false
      })
    }
    
  },
  computed: {
    
  }
};
</script>
<style lang="scss" scoped>
  /* .el-col{
    border:1px solid red;
  } */
  .el-tag{
    color:#fff;
  }
  .button{
    text-align: right;
  }
  .el-input,.el-select{
    width:100%;
  }
  .el-form-item{
    text-align: right;
  }
  .cat-row{
    height:40px;
    line-height:40px;
    border-bottom:1px solid #EBEEF5;
  }
</style>
