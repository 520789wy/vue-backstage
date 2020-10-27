<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="9">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表信息 -->
      <el-table border style="width: 100%" :data="goodsProductList">
        <el-table-column type="index" label="#" ></el-table-column>
        <!-- 商品名称 -->
        <el-table-column  label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column  label="商品价格(元)" prop="goods_price"></el-table-column>
        <el-table-column  label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column  label="创建时间" prop="add_time"></el-table-column>
        <el-table-column  label="操作"></el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[1,2, 5, 10]"
      :page-size="100"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
    data(){
        return {
          queryInfo:{
            query:"",
            pagenum:1,//当前页数
            pagesize:10
          },
          goodsProductList:[],
          total:""
        }
    },
    created () {
        this.getGoodsList()
    },
    methods:{
        //获取商品列表数据
        async getGoodsList(){
            const {data : res } = await this.$http.get("goods",{params:this.queryInfo})
            if(res.meta.status !== 200){
               return this.$message.error("获取商品列表失败")
            }
              this.goodsProductList = res.data.goods
              this.total =res.data.total
            
        }    
    }
};
</script>
<style lang="scss" scoped></style>
