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
        <el-button type="primary" @click="dialogVisible = true">添加分类</el-button>
      </el-row>
      <el-table
        :data="goodsCategories"
        border
        style="width: 100%"
        align="center"
      >
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 分类名称 -->
        <el-table-column label="分类名称" prop="cat_name" >
           <!-- <template slot-scope="scope">
             <el-table :data="scope.row.children">
              <el-table-column type="index"></el-table-column>
              <el-table-column prop="cat_name"></el-table-column>
             </el-table>v-if="scope.row.cat_deleted == 'false'" 
          </template>true -->
        </el-table-column>
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
          <template>
            <el-button type="success" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
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
      <el-form ref="form" :model="addCategory" label-width="80px" >
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
          <el-button>取消</el-button>
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
      //存放添加分类信息数据
      addCategory:{
        cat_name:'',
        category_name:''
      }
      
    };
  },
  created() {
    this.hetgoodsCategories();
  },
  methods: {
    async hetgoodsCategories() {
      //获取商品分类
      const { data: res } = await this.$http.get("categories",{params:this.queryInfo});
      if (res.meta.status !== 200) {
        return this.$message.error("商品分类列表获取失败");
      }
      this.goodsCategories = res.data.result;
      this.total = res.data.total
      console.log( this.goodsCategories)
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
    //添加分类信息
    async CategorySubmit(){
      const {data:res} = await this.$http.post("categories",this.addCategory)
      if(res.meta.status !== 201){
        console.log("创建失败")
      }
    }
  },
  computed: {
    
  }
};
</script>
<style lang="scss" scoped>
  .el-col{
    border:1px solid red;
  }
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
</style>
